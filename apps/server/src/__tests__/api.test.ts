import request from 'supertest';

jest.mock('@octokit/rest', () => {
  return {
    Octokit: jest.fn().mockImplementation(() => ({
      repos: {
        listForUser: jest.fn().mockResolvedValue({ data: [] }),
      },
    })),
  };
});

import { app } from '../index';
import { connect, closeDatabase, clearDatabase } from '../../jest.setup';

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await clearDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe('API Tests', () => {
  describe('GET /health', () => {
    it('should return 200 OK', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
    });
  });

  describe('Auth Flow', () => {
    it('should fail login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({ password: 'wrongpassword' });
      expect(res.status).toBe(401);
    });
  });

  describe('Profile Flow', () => {
    it('should fetch profile empty state', async () => {
      const res = await request(app).get('/api/v1/profile');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toBeNull();
    });
  });

  describe('Projects Flow', () => {
    it('should fetch empty projects list', async () => {
      const res = await request(app).get('/api/v1/projects');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toEqual([]);
    });
  });
});
