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

describe('Topics API', () => {
  it('should get topics for a subject', async () => {
    const subjectId = 1; // Mathematics
    console.log('Making request to topics endpoint...');
    
    const response = await request(baseURL)
      .get(`/api/students/topics?studentId=${studentId}&subjectId=${subjectId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect('Content-Type', /json/)
      .expect(200);

    console.log('Response body:', response.body);

    // First verify we got a response
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    
    // Then check the properties if we have data
    if (response.body.length > 0) {
      const firstTopic = response.body[0];
      console.log('First topic:', firstTopic);
      
      // Log all properties we received
      console.log('Properties in response:', Object.keys(firstTopic));
      
      // Check what properties exist
      expect(firstTopic).toBeDefined();
    }
  });
}); 