import request from 'supertest';
import app from '../src/backend/index';
import { getAuthToken } from './helpers/auth';
import { pool } from '../src/backend/config/database';

describe('Topics API', () => {
  afterAll(async () => {
    await pool.end();
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  it('should get topics for a subject', async () => {
    const { token: authToken, studentId } = await getAuthToken();
    const subjectId = 1;

    const response = await request(app)
      .get(`/api/students/topics?studentId=${studentId}&subjectId=${subjectId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBeTruthy();
  }, 30000);
}); 