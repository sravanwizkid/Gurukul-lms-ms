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
    // First check basic properties
    expect(firstKItem).toMatchObject({
      kitemId: expect.any(Number),
      kitemType: expect.any(String)
    });

    // Check additional properties if they exist
    if (firstKItem.experienceType !== undefined) {
      expect(firstKItem.experienceType).toEqual(expect.any(String));
    }
    if (firstKItem.kdesc !== undefined) {
      expect(firstKItem.kdesc).toEqual(expect.any(String));
    }
    if (firstKItem.isCompleted !== undefined) {
      expect(firstKItem.isCompleted).toBe(false);
    }
    if (firstKItem.isLocked !== undefined) {
      expect(firstKItem.isLocked).toBe(false);
    }
    
    // Check progress value if it exists
    if (firstKItem.progress !== undefined) {
      expect([0, 'in progress']).toContain(firstKItem.progress);
    }

    // Verify kurl exists and is either a string or empty
    expect(firstKItem).toHaveProperty('kurl');
    expect(typeof firstKItem.kurl === 'string' || firstKItem.kurl === '').toBeTruthy();

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