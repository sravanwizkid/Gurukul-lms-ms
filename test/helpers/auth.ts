import request from 'supertest';
import app from '../../src/backend/index';

export const getAuthToken = async () => {
  const response = await request(app)
    .post('/api/students/auth')
    .send({
      email: 'test@example.com',
      password: 'test123'
    });

  if (!response.body.token) {
    throw new Error('No token received from auth API');
  }

  return {
    token: response.body.token,
    studentId: response.body.studentId
  };
}; 