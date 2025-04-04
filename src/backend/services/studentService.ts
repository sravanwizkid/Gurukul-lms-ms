import { Pool } from 'pg';
import { AuthRequest, AuthResponse, StudentAuth, StudentMilestone, SubjectResponse, TopicResponse, LessonResponse, Lesson, KItemResponse, KItem, MediaType } from '../types';
import { ApiError } from '../middleware/errorHandler';
import { pool } from '../config/database';
import jwt from 'jsonwebtoken';
import { AuthData } from '../types/auth';

interface DBTopic {
  tid: number;
  tname: string;
}

interface DBSubject {
  subid: number;
  subname: string;
}

interface DBLesson {
  lid: number;
  lname: string;
}

interface DBKItem {
  kid: number;
  ktype: MediaType;
  kexp: string;
  kurl: string;
  kdesc: string;
}

const getStudentByEmail = async (email: string) => {
  const query = 'SELECT * FROM students WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

export const authenticateStudent = async (authData: AuthData): Promise<AuthResponse> => {
  try {
    const student = await getStudentByEmail(authData.email);
    console.log('Auth attempt:', {
      email: authData.email,
      foundStudent: !!student,
      providedPass: authData.password,
      storedHash: student?.password_hash
    });

    if (!student) {
      return { success: false, message: 'Student not found' } as AuthResponse;
    }

    const validPassword = authData.password === student.password_hash;
    console.log('Password validation:', { validPassword });

    if (!validPassword) {
      return { success: false, message: 'Invalid password' } as AuthResponse;
    }

    // 2. Check if Student is in a Gurukul
    const gurukulQuery = await pool.query(
      'SELECT gid FROM sgurukul WHERE sid = $1 AND status IN (\'Started\', \'In_progress\')',
      [student.sid]
    );
    console.log('Gurukul query results:', {
      count: gurukulQuery.rowCount,
      rows: gurukulQuery.rows
    });

    if (gurukulQuery.rows.length === 0) {
      throw new ApiError(404, 'Student not part of any active Gurukul');
    }

    // 3. Get the Milestone ID
    const milestoneQuery = await pool.query(
      'SELECT mid FROM smilestones WHERE sid = $1 AND status IN (\'Started\', \'In_progress\') AND mid IS NOT NULL',
      [student.sid]
    );
    console.log('Milestone query results:', {
      count: milestoneQuery.rowCount,
      rows: milestoneQuery.rows
    });

    if (milestoneQuery.rows.length === 0) {
      throw new ApiError(404, 'No active milestone found for student');
    }

    // 4. Fetch Class, Level, and Gurukul Type
    const studentInfoQuery = await pool.query<StudentMilestone>(
      'SELECT gtype, class, level FROM milestones WHERE mid = $1',
      [milestoneQuery.rows[0].mid]
    );
    console.log('Student info query results:', {
      count: studentInfoQuery.rowCount,
      rows: studentInfoQuery.rows,
      mid: milestoneQuery.rows[0].mid
    });

    if (studentInfoQuery.rows.length === 0) {
      throw new ApiError(404, 'Student milestone information not found');
    }

    const studentInfo = studentInfoQuery.rows[0];

    // 3. Generate JWT token
    const token = jwt.sign(
      {
        studentId: student.sid,
        studentClass: studentInfo.class,
        studentLevel: studentInfo.level,
        gurukulType: studentInfo.gtype
      },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '24h' }
    );

    return {
      studentId: student.sid,
      studentClass: studentInfo.class,
      studentLevel: studentInfo.level,
      gurukulType: studentInfo.gtype,
      token
    };
  } catch (error) {
    console.error('Error in authenticate:', error);
    throw error;
  }
};

export const fetchSubjectsOrTopics = async (studentId: number, subjectId?: number) => {
  try {
    console.log('Fetching subjects/topics:', { studentId, subjectId });

    if (subjectId) {
      // Fixed topics query with correct casing
      const topicsQuery = await pool.query(
        'SELECT t.tid as "topicId", t.tname as "topicName" FROM topics t ' +
        'JOIN subjects s ON t.subid = s.subid ' +
        'WHERE s.subid = $1',
        [subjectId]
      );
      console.log('Topics query result:', topicsQuery.rows);
      return topicsQuery.rows;
    } else {
      // Subjects query
      const subjectsQuery = await pool.query(
        'SELECT s.subid as subjectId, s.subname as subjectName FROM subjects s'
      );
      console.log('Subjects query result:', subjectsQuery.rows);
      return subjectsQuery.rows;
    }
  } catch (error) {
    console.error('Error in fetchSubjectsOrTopics:', error);
    throw error;
  }
};

export const fetchLessons = async (studentId: number, topicId: number): Promise<LessonResponse[]> => {
  console.log('Fetching lessons for student:', studentId, 'topic:', topicId);

  // 1. Get active journey
  const journeyQuery = await pool.query<{ jid: number }>(
    `SELECT jid 
     FROM slog 
     WHERE sid = $1 
     AND status = 'In_progress' 
     AND jid IS NOT NULL
     ORDER BY starttime DESC 
     LIMIT 1`,
    [studentId]
  );

  if (journeyQuery.rows.length === 0) {
    throw new ApiError(404, 'No active journey found for the student');
  }

  const jid = journeyQuery.rows[0].jid;

  // 2. Verify topic exists in journey
  const topicVerifyQuery = await pool.query(
    `SELECT t.tid
     FROM journey j
     JOIN subjects s ON j.subject_id = s.subid
     JOIN topics t ON t.subid = s.subid
     WHERE j.jid = $1 AND t.tid = $2`,
    [jid, topicId]
  );

  if (topicVerifyQuery.rows.length === 0) {
    throw new ApiError(404, 'Topic not found in student journey');
  }

  // 3. Get lessons for the topic
  const lessonsQuery = await pool.query<DBLesson>(
    `SELECT l.lid, l.lname
     FROM lessons l
     WHERE l.tid = $1
     ORDER BY l.lid`,
    [topicId]
  );

  return lessonsQuery.rows.map((lesson: DBLesson) => ({
    lessonId: lesson.lid,
    lessonName: lesson.lname,
    progress: 'in progress',
    isCompleted: false,
    isLocked: false
  }));
};

export const fetchKItems = async (
  studentId: number, 
  topicId: number,
  lessonId: number
): Promise<KItemResponse[]> => {
  console.log('Fetching kitems for student:', studentId, 'topic:', topicId, 'lesson:', lessonId);

  // 1. Get active journey
  const journeyQuery = await pool.query<{ jid: number }>(
    `SELECT jid 
     FROM slog 
     WHERE sid = $1 
     AND status = 'In_progress' 
     AND jid IS NOT NULL
     ORDER BY starttime DESC 
     LIMIT 1`,
    [studentId]
  );

  if (journeyQuery.rows.length === 0) {
    throw new ApiError(404, 'No active journey found for the student');
  }

  const jid = journeyQuery.rows[0].jid;

  // 2. Get kroute for the topic and lesson
  const krouteQuery = await pool.query<{ kroute: number }>(
    `SELECT kroute 
     FROM journey 
     WHERE jid = $1 
     AND topics_id = $2 
     AND lesson_id = $3`,
    [jid, topicId, lessonId]
  );

  if (krouteQuery.rows.length === 0) {
    throw new ApiError(404, 'Topic and lesson not found in student journey');
  }

  const krid = krouteQuery.rows[0].kroute;

  // 3. Get kitems from kroutes
  const kitemsQuery = await pool.query<{ kitems: number[] }>(
    `SELECT kitems 
     FROM kroutes 
     WHERE krid = $1`,
    [krid]
  );

  if (kitemsQuery.rows.length === 0) {
    throw new ApiError(404, 'No kitems found for this lesson');
  }

  const kitemIds = kitemsQuery.rows[0].kitems;

  // 4. Get kitem details
  const kitemDetailsQuery = await pool.query<DBKItem>(
    `SELECT 
       kid AS "kid",
       ktype AS "ktype",
       kexp AS "kexp",
       kurl,
       kdesc
     FROM kitems 
     WHERE kid = ANY($1)
     ORDER BY kid`,
    [kitemIds]
  );

  console.log('Raw kitem query results:', kitemDetailsQuery.rows);

  const mappedResults = kitemDetailsQuery.rows.map((kitem: DBKItem) => {
    console.log('Mapping kitem:', kitem);
    return {
      kitemId: kitem.kid,
      kitemType: kitem.ktype as MediaType,
      experienceType: kitem.kexp,
      kurl: kitem.kurl,
      kdesc: kitem.kdesc,
      progress: 'in progress',
      isCompleted: false,
      isLocked: false
    };
  });

  console.log('Mapped results:', mappedResults);  // Log final results
  return mappedResults;
}; 