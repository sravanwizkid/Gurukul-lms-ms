import request from 'supertest';
import { pool } from '../src/backend/config/database';
import { getAuthToken } from './helpers/auth';

const API_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('KItems API', () => {
  beforeAll(async () => {
    console.log('Starting kitems tests...');
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should get kitems for a lesson', async () => {
    const { token, studentId } = await getAuthToken();
    const topicId = 1;    // Using known test topic ID
    const lessonId = 101;   // Using known test lesson ID
    
    const response = await request(API_URL)
      .get(`/api/students/kitems?studentId=${studentId}&topicId=${topicId}&lessonId=${lessonId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    // Add more specific assertions about kitems if needed
  });
}); 