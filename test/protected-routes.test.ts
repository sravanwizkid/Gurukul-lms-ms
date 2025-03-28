import request from 'supertest';
import dotenv from 'dotenv';
import { getAuthToken } from './helpers/auth';

dotenv.config();

const baseURL = process.env.API_BASE_URL || 'https://gurukul-sm-api-b5xafjcvta-el.a.run.app';
let authToken: string;
let studentId: number;

beforeAll(async () => {
  const auth = await getAuthToken();
  authToken = auth.token;
  studentId = auth.studentId;
});

describe('Protected Routes', () => {
  // Subjects
  it('should get subjects for student', async () => {
    const response = await request(baseURL)
      .get(`/api/students/subjects?studentId=${studentId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBeTruthy();
    if (response.body.length > 0) {
      expect(response.body[0]).toHaveProperty('subjectid');
      expect(response.body[0]).toHaveProperty('subjectname');
    }
  });

  // Topics
  it('should get topics for a subject', async () => {
    const subjectId = 1;
    const response = await request(baseURL)
      .get(`/api/students/topics?studentId=${studentId}&subjectId=${subjectId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    expect(Array.isArray(response.body)).toBeTruthy();
    if (response.body.length > 0) {
      expect(response.body[0]).toHaveProperty('topicId');
      expect(response.body[0]).toHaveProperty('topicName');
    }
  });
}); 