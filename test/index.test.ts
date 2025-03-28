import './health.test';
import './auth.test';
import './subjects.test';
import './topics.test';
import './lessons.test';
import './kitems.test';

describe('API Test Suite', () => {
  it('runs all tests', () => {
    expect(true).toBeTruthy();
  });

  beforeAll(() => {
    console.log('Starting API Test Suite...');
  });

  afterAll(() => {
    console.log('API Test Suite completed.');
  });
}); 