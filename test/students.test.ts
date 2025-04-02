import request from 'supertest';
import app from '../src/backend/index';
import { getAuthToken } from './helpers/auth';
import { pool } from '../src/backend/config/database';

describe('Students API', () => {
  afterAll(async () => {
    await pool.end();
    await new Promise(resolve => setTimeout(resolve, 1000));
  });

  it('should get all students', async () => {
    const { token: authToken } = await getAuthToken();

    console.log('Making request to students list endpoint...', {
      token: authToken?.substring(0, 20) + '...'
    });

    const response = await request(app)
      .get('/api/students')
      .set('Authorization', `Bearer ${authToken}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    console.log('Response:', {
      status: response.status,
      headers: response.headers,
      count: response.body.length
    });

    expect(Array.isArray(response.body)).toBeTruthy();
  }, 30000);

  it('should get student by id', async () => {
    const { token: authToken, studentId } = await getAuthToken();

    console.log('Making request to student detail endpoint...', {
      studentId,
      token: authToken?.substring(0, 20) + '...'
    });

    const response = await request(app)
      .get(`/api/students/${studentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200);

    console.log('Response:', {
      status: response.status,
      headers: response.headers,
      body: response.body
    });

    expect(response.body).toBeDefined();
  }, 30000);
});
