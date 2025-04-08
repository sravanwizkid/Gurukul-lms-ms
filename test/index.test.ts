import request from 'supertest';
import { logger } from '../src/backend/utils/logger';
import { getAuthToken } from './helpers/auth';

const API_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('API Test Suite', () => {
  beforeAll(async () => {
    logger.info('Starting API Test Suite...');
  });

  afterAll(async () => {
    logger.info('API Test Suite completed.');
  });

  it('verifies health check', async () => {
    const response = await request(API_URL)
      .get('/_health')
      .set('Accept', 'application/json');
    expect(response.status).toBe(200);
  });

  it('authenticates user', async () => {
    const response = await request(API_URL)
      .post('/api/students/auth')
      .send({
        email: process.env.TEST_USER_EMAIL,
        password: process.env.TEST_USER_PASSWORD
      })
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('studentId', 2);
  });

  it('gets subjects list', async () => {
    const { token, studentId } = await getAuthToken();
    
    const response = await request(API_URL)
      .get(`/api/students/subjects?studentId=${studentId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('gets topics for subject', async () => {
    const { token, studentId } = await getAuthToken();
    const subjectId = 1;
    
    const response = await request(API_URL)
      .get(`/api/students/topics?studentId=${studentId}&subjectId=${subjectId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('gets lessons for topic', async () => {
    const { token, studentId } = await getAuthToken();
    const topicId = 1;
    
    const response = await request(API_URL)
      .get(`/api/students/lessons?studentId=${studentId}&topicId=${topicId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('gets kitems for lesson', async () => {
    const { token, studentId } = await getAuthToken();
    const topicId = 1;
    const lessonId = 101;
    
    const response = await request(API_URL)
      .get(`/api/students/kitems?studentId=${studentId}&topicId=${topicId}&lessonId=${lessonId}`)
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', 'application/json');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
}); 