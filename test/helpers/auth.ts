import request from 'supertest';
import app from '../../src/backend/index';
import dotenv from 'dotenv';
import path from 'path';

// Load test environment variables
dotenv.config({ path: path.join(__dirname, '../../.env.test') });

export async function getAuthToken(): Promise<{ token: string; studentId: number }> {
  const response = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test@example.com',
      password: 'test123'
    })
    .expect(200)
    .expect('Content-Type', /json/);

  if (!response.body.token) {
    throw new Error('No token received from auth API');
  }

  return {
    token: response.body.token,
    studentId: response.body.studentId
  };
} 