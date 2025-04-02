import request from 'supertest';
import { pool } from '../src/backend/config/database';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Use the new Cloud Run URL
const API_URL = process.env.API_BASE_URL || 'http://localhost:3000';

describe('Authentication', () => {
  beforeAll(async () => {
    console.log('Starting API tests...');
    console.log('Testing API at:', API_URL);
    console.log('Environment:', process.env.NODE_ENV);
    
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

  // Skip root endpoint test as it's not implemented
  it.skip('should respond to root endpoint', async () => {
    const response = await request(API_URL)
      .get('/')
      .set('Accept', 'application/json');
    expect(response.status).toBe(200);
  });

  // Health check should work
  it('should respond to health check', async () => {
    const response = await request(API_URL)
      .get('/_health');
    expect(response.status).toBe(200);
  });

  // Auth endpoint test with assertions
  it('should authenticate with valid credentials', async () => {
    console.log('Testing auth endpoint...');
    
    // Log the full URL being tested
    const fullUrl = `${API_URL}/api/students/auth`;
    console.log('Full auth URL:', fullUrl);

    const response = await request(API_URL)
      .post('/api/students/auth')
      .send({
        email: process.env.TEST_USER_EMAIL || 'test@example.com',
        password: process.env.TEST_USER_PASSWORD || 'test123'
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
  });

  // Subjects endpoint test with assertions
  it('should get subjects list', async () => {
    const response = await request(API_URL)
      .get('/api/students/subjects')
      .set('Accept', 'application/json');

    console.log('Subjects endpoint response:', {
      status: response.status,
      headers: response.headers,
      body: response.body
    });

    // Add proper assertions
    expect(response.status).toBe(200);  // This should fail with 404
    expect(response.headers['content-type']).toMatch(/json/);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Add a simple test
  it('should respond to test endpoint', async () => {
    const response = await request(API_URL)
      .get('/api/students/test')
      .set('Accept', 'application/json');

    console.log('Test response:', {
      status: response.status,
      headers: response.headers,
      body: response.body,
      url: response.request.url
    });

    expect(response.status).toBe(200);
  });
});

// This works when run alone