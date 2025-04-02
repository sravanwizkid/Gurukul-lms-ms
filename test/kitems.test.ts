import request from 'supertest';
import app from '../src/backend/index';
import { getAuthToken } from './helpers/auth';
import { pool } from '../src/backend/config/database';

describe('KItems API', () => {
  afterAll(async () => {
    await pool.end();
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  it('should get knowledge items for a lesson', async () => {
    const { token: authToken, studentId } = await getAuthToken();
    const topicId = 1;    // Using known topic ID
    const lessonId = 101; // Using known lesson ID from previous test

    console.log('Making request to kitems endpoint...', {
      studentId,
      topicId,
      lessonId,
      token: authToken?.substring(0, 20) + '...'
    });

    const response = await request(app)
      .get(`/api/students/kitems?studentId=${studentId}&topicId=${topicId}&lessonId=${lessonId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    console.log('Response:', {
      status: response.status,
      headers: response.headers,
      body: response.body
    });

    expect(Array.isArray(response.body)).toBeTruthy();
  }, 30000);
}); 