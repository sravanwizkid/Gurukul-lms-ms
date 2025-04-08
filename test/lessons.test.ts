import request from 'supertest';
import { pool } from '../src/backend/config/database';
import { getAuthToken } from './helpers/auth';

const API_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('Lessons API', () => {
  beforeAll(async () => {
    console.log('Starting lessons tests...');
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should get lessons for a topic', async () => {
    const { token, studentId } = await getAuthToken();
    const topicId = 1;  // Using known test topic ID
    
    const response = await request(API_URL)
      .get(`/api/students/lessons?studentId=${studentId}&topicId=${topicId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    // Add more specific assertions about lessons if needed
  });
}); 