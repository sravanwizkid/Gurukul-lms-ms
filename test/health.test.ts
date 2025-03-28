import request from 'supertest';
import dotenv from 'dotenv';

dotenv.config();

const baseURL = process.env.API_BASE_URL || 'https://gurukul-sm-api-b5xafjcvta-el.a.run.app';

describe('Health Check', () => {
  it('should return health status', async () => {
    const response = await request(baseURL)
      .get('/_health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
  });
}); 