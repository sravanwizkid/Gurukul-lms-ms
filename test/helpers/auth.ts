import request from 'supertest';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

export const getAuthToken = async () => {
  const response = await request(API_BASE_URL)
    .post('/api/students/auth')
    .send({
      email: process.env.TEST_USER_EMAIL,
      password: process.env.TEST_USER_PASSWORD
    });

  return {
    token: response.body.token,
    studentId: response.body.studentId
  };
}; 