import request from 'supertest';
import dotenv from 'dotenv';

dotenv.config();

let authToken: string;
let studentId: number;

export async function getAuthToken(): Promise<{token: string, studentId: number}> {
  // If token exists and not expired, return it
  if (authToken) {
    return { token: authToken, studentId };
  }

  const baseURL = process.env.API_BASE_URL || 'https://gurukul-sm-api-b5xafjcvta-el.a.run.app';
  
  const response = await request(baseURL)
    .post('/api/students/auth')
    .send({
      email: "test@example.com",
      password: "test123"
    });

  authToken = response.body.token;
  studentId = response.body.studentId;

  return { token: authToken, studentId };
} 