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

describe('KItems API', () => {
  it('should get KItems for a lesson with correct properties', async () => {
    const topicId = 1;    // Algebra
    const lessonId = 101; // Introduction to Algebra
    
    const response = await request(baseURL)
      .get(`/api/students/kitems?studentId=${studentId}&topicId=${topicId}&lessonId=${lessonId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    // Verify array response
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body.length).toBeGreaterThan(0);
    
    // Test first KItem with actual properties from API
    const firstKItem = response.body[0];
    expect(firstKItem).toMatchObject({
      kitemId: expect.any(Number),
      kitemType: expect.any(String),
      experienceType: expect.any(String),
      kdesc: expect.any(String),
      isCompleted: false,
      isLocked: false
    });

    // Verify kurl exists and is either a string or empty
    expect(firstKItem).toHaveProperty('kurl');
    expect(typeof firstKItem.kurl === 'string' || firstKItem.kurl === '').toBeTruthy();

    // Check progress separately to handle both number and string formats
    expect(['in progress', 0]).toContain(firstKItem.progress);

    // Log success with details
    console.log('KItems verification passed:', {
      totalKItems: response.body.length,
      firstKItem: {
        id: firstKItem.kitemId,
        type: firstKItem.kitemType,
        experience: firstKItem.experienceType,
        description: firstKItem.kdesc,
        url: firstKItem.kurl || 'No URL provided'
      }
    });
  });
}); 