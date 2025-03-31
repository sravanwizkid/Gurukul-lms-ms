import request from 'supertest';
import dotenv from 'dotenv';
import { getAuthToken } from './helpers/auth';

dotenv.config();

const baseURL = process.env.API_BASE_URL || 'https://gurukul-sm-api-b5xafjcvta-el.a.run.app';
let authToken: string;
let studentId: number;

beforeAll(async () => {
  // Get token before all tests
  const auth = await getAuthToken();
  authToken = auth.token;
  studentId = auth.studentId;
});

describe('Subjects API', () => {
  it('should get subjects for student', async () => {
    const response = await request(baseURL)
      .get(`/api/students/subjects?studentId=${studentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBeTruthy();
    if (response.body.length > 0) {
      expect(response.body[0]).toHaveProperty('subjectId');
      expect(response.body[0]).toHaveProperty('subjectName');
      
      // Log the response for verification
      console.log('Subject response:', response.body[0]);
    }
  });
}); 