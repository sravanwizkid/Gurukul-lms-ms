import request from 'supertest';
import { pool } from '../src/backend/config/database';
import { getAuthToken } from './helpers/auth';

const API_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('Subjects API', () => {
  beforeAll(async () => {
    console.log('Starting subjects tests...');
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should get subjects for student', async () => {
    const { token, studentId } = await getAuthToken();
    
    const response = await request(API_URL)
      .get(`/api/students/subjects?studentId=${studentId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});