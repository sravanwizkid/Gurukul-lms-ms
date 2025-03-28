import request from 'supertest';
import dotenv from 'dotenv';
import { getAuthToken } from './helpers/auth';

dotenv.config();

const baseURL = process.env.API_BASE_URL || 'https://gurukul-sm-api-b5xafjcvta-el.a.run.app';

describe('Authentication', () => {
  it('should authenticate student and return token', async () => {
    const { token, studentId } = await getAuthToken();

    expect(token).toBeDefined();
    expect(studentId).toBeDefined();
    
    // Show more detailed information
    console.log('Authentication successful:', {
      studentId,
      tokenPreview: token.substring(0, 20) + '...' // Shows first 20 chars of token
    });
  });
}); 