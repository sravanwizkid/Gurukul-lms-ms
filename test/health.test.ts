import request from 'supertest';
import { pool } from '../src/backend/config/database';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use the new Cloud Run URL
const API_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('Health Check', () => {
  beforeAll(async () => {
    console.log('Starting health check tests...');
    console.log('Testing API at:', API_URL);
  });

  it('should respond to health check', async () => {
    const response = await request(API_URL)
      .get('/_health');
    expect(response.status).toBe(200);
  });
}); 