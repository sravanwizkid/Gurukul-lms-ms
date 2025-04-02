import './health.test';
import './auth.test';
import './subjects.test';
import './topics.test';
import './lessons.test';
import './kitems.test';
import { cleanupDatabase } from './helpers/cleanup';

describe('API Test Suite', () => {
  beforeAll(() => {
    console.log('Starting API Test Suite...');
  });

  afterAll(async () => {
    console.log('Cleaning up database connections...');
    await cleanupDatabase();
    console.log('API Test Suite completed.');
  });

  it('runs all tests', () => {
    expect(true).toBeTruthy();
  });
}); 