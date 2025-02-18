import request from 'supertest';
import app from '../src/app';

describe('App Endpoint Tests', () => {
  // Test root endpoint
  describe('GET /', () => {
    it('should return API location message', async () => {
      const response = await request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        message: 'API location: api/v1', "swagger": "/api-docs",
      });
    });
  });

  // Test 404 handler
  describe('404 Handler', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('Not Found');
    });
  });

  // Test CORS, Helmet, and JSON middleware
  describe('Middleware Tests', () => {
    it('should accept JSON payloads', async () => {
      const response = await request(app)
        .post('/api/v1/posts')
        .send({ test: 'data' })
        .expect('Content-Type', /json/);

      // Even if unauthorized, this proves JSON middleware is working
      expect(response.status).not.toBe(415);
    });

    it('should have security headers (Helmet)', async () => {
      const response = await request(app).get('/');
      
      expect(response.headers).toHaveProperty('x-dns-prefetch-control');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-content-type-options');
    });

    it('should have CORS headers', async () => {
      const response = await request(app).get('/');
      
      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });
  });
});