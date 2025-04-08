import request from 'supertest';
import { pool } from '../src/backend/config/database';
import { getAuthToken } from './helpers/auth';

const API_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('Topics API', () => {
  beforeAll(async () => {
    console.log('Starting topics tests...');
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should get topics for a subject', async () => {
    const { token, studentId } = await getAuthToken();
    const subjectId = 1;  // Using known test subject ID
    
    const response = await request(API_URL)
      .get(`/api/students/topics?studentId=${studentId}&subjectId=${subjectId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    // Add more specific assertions about topics if needed
  });
}); 