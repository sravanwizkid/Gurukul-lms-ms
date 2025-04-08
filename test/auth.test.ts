import request from 'supertest';
import { pool } from '../src/backend/config/database';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use the new Cloud Run URL
const API_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('Authentication', () => {
  beforeAll(async () => {
    console.log('Starting auth tests...');
    console.log('Testing API at:', API_URL);
    
    await new Promise<void>((resolve) => {
      pool.on('connect', () => {
        console.log('Database connected successfully');
        resolve();
      });
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  // Auth endpoint test with assertions
  it('should authenticate with valid credentials', async () => {
    console.log('Testing auth endpoint...');
    
    const response = await request(API_URL)
      .post('/api/students/auth')
      .send({
        email: process.env.TEST_USER_EMAIL,
        password: process.env.TEST_USER_PASSWORD
      })
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json');

    // Log the complete response
    console.log('Complete auth response:', {
      status: response.status,
      headers: response.headers,
      body: response.body,
      error: response.error,
      text: response.text
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('studentId', 2);
    expect(response.body).toHaveProperty('studentClass', 6);
    expect(response.body).toHaveProperty('studentLevel', 'L6');
    expect(response.body).toHaveProperty('gurukulType', 'G2');
  });
});

// This works when run alone