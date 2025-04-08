import request from 'supertest';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use the new Cloud Run URL
const API_URL = process.env.API_BASE_URL || 'http://localhost:3000';

export const getAuthToken = async () => {
  const response = await request(API_URL)  // Use API_URL instead of app
    .post('/api/students/auth')
    .send({
      email: process.env.TEST_USER_EMAIL,
      password: process.env.TEST_USER_PASSWORD
    });

  if (!response.body.token) {
    throw new Error('No token received from auth API');
  }

  return {
    token: response.body.token,
    studentId: response.body.studentId
  };
}; 