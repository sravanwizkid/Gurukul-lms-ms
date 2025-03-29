import { config } from 'dotenv';

config(); // Load environment variables from .env file

process.env.API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
process.env.TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || 'test@example.com';
process.env.TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'password123'; 