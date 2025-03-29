import request from 'supertest';
import dotenv from 'dotenv';
import { getAuthToken } from './helpers/auth';

dotenv.config();

const baseURL = process.env.API_BASE_URL || 'https://gurukul-sm-api-b5xafjcvta-el.a.run.app';
let authToken: string;
let studentId: number;

beforeAll(async () => {
  const auth = await getAuthToken();
  authToken = auth.token;
  studentId = auth.studentId;
});

describe('Lessons API', () => {
  it('should get lessons for a topic with default progress values', async () => {
    const topicId = 1; // Using first topic (Algebra)
    
    const response = await request(baseURL)
      .get(`/api/students/lessons?studentId=${studentId}&topicId=${topicId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    // Verify array response
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
    
    // Test first lesson with all properties including defaults
    const firstLesson = response.body[0];
    // First check basic properties
    expect(firstLesson).toMatchObject({
      lessonId: expect.any(Number),
      lessonName: expect.any(String)
    });
    // Then check progress value can be either 0 or "in progress"
    expect([0, 'in progress']).toContain(firstLesson.progress);
    // Then check boolean flags
    expect(firstLesson.isCompleted).toBe(false);
    expect(firstLesson.isLocked).toBe(false);

    // Log success with details
    console.log('Lesson details:', {
      totalLessons: response.body.length,
      firstLesson: {
        id: firstLesson.lessonId,
        name: firstLesson.lessonName,
        progress: firstLesson.progress,
        isCompleted: firstLesson.isCompleted,
        isLocked: firstLesson.isLocked
      }
    });
  });
}); 