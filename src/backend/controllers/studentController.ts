import { Request, Response } from 'express';
import { ApiError } from '../middlewares/errorHandler';
import { AuthRequest } from '../types';
import { authenticate, fetchSubjectsOrTopics, fetchLessons, fetchKItems } from '../services/studentService';
import { pool } from '../config/database';
import { logger } from '../utils/logger';

export const authenticateStudent = async (req: Request, res: Response) => {
  try {
    // Validate request body
    if (!req.body || !req.body.email || !req.body.password) {
      logger.warn('Invalid auth request:', {
        hasBody: !!req.body,
        hasEmail: !!req.body?.email,
        hasPassword: !!req.body?.password
      });
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['email', 'password']
      });
    }

    const result = await authenticate({ 
      email: req.body.email, 
      password: req.body.password 
    });

    if (!result || !result.token) {
      logger.warn('Auth failed:', { email: req.body.email });
      return res.status(401).json({ error: 'Authentication failed' });
    }

    logger.info('Auth successful:', { email: req.body.email });
    return res.status(200).json(result);
  } catch (error) {
    logger.error('Auth error:', error);
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSubjectsOrTopics = async (req: Request, res: Response) => {
  try {
    const studentId = parseInt(req.query.studentId as string);
    const subjectId = req.query.subjectId ? parseInt(req.query.subjectId as string) : undefined;
    
    // Use path to determine if topics or subjects
    const isTopicsRequest = req.path === '/topics';
    
    if (isTopicsRequest && !subjectId) {
      return res.status(400).json({ error: 'Subject ID is required for topics' });
    }

    const results = await fetchSubjectsOrTopics(studentId, isTopicsRequest ? subjectId : undefined);
    res.json(results);
  } catch (error) {
    console.error('Error fetching:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getLessons = async (req: Request, res: Response) => {
  try {
    const studentId = Number(req.query.studentId);
    const topicId = Number(req.query.topicId);

    if (!studentId || !topicId) {
      throw new ApiError(400, 'Student ID and Topic ID are required');
    }

    const result = await fetchLessons(studentId, topicId);
    res.json(result);
  } catch (error) {
    if (error instanceof Error) {
      res.status(error instanceof ApiError ? error.statusCode : 500)
         .json({ error: error.message });
    }
  }
};

export const getKItems = async (req: Request, res: Response) => {
  try {
    const studentId = Number(req.query.studentId);
    const topicId = Number(req.query.topicId);
    const lessonId = Number(req.query.lessonId);

    if (!studentId || !topicId || !lessonId) {
      throw new ApiError(400, 'Student ID, Topic ID, and Lesson ID are required');
    }

    const result = await fetchKItems(studentId, topicId, lessonId);
    console.log('Controller sending response:', JSON.stringify(result, null, 2));
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(result));
  } catch (error) {
    if (error instanceof Error) {
      res.status(error instanceof ApiError ? error.statusCode : 500)
         .json({ error: error.message });
    }
  }
};

export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM students');
    logger.info(`Retrieved ${result.rows.length} students`);
    return res.status(200).json(result.rows);
  } catch (error) {
    logger.error('Error fetching students:', error);
    return res.status(500).json({ message: 'Error fetching students' });
  }
};

export const getStudentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM students WHERE sid = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    // Remove password_hash from response
    const { password_hash, ...studentData } = result.rows[0];
    return res.status(200).json(studentData);
  } catch (error) {
    logger.error('Error fetching student:', error);
    return res.status(500).json({ message: 'Error fetching student' });
  }
};

// Check if rate limiting is here 