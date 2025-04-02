import request from 'supertest';
import app from '../src/backend/index';
import { getAuthToken } from './helpers/auth';
import { pool } from '../src/backend/config/database';

describe('Subjects API', () => {
  afterAll(async () => {
    await pool.end();
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  it('should get subjects for student', async () => {
    const { token: authToken, studentId } = await getAuthToken();

    const response = await request(app)
      .get(`/api/students/subjects?studentId=${studentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBeTruthy();
  }, 30000);
});