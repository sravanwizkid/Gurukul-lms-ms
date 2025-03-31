import request from 'supertest';
import app from '../src/backend/index';
import { getAuthToken } from './helpers/auth';

describe('Authentication', () => {
  it('should authenticate student and return token', async () => {
    const { token, studentId } = await getAuthToken();
    
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
    expect(studentId).toBeDefined();
    expect(typeof studentId).toBe('number');
    
    console.log('Authentication successful:', {
      studentId,
      tokenPreview: token.substring(0, 15) + '...'
    });
  });
}); 