const request = require('supertest');
const express = require('express');
const authRoutes = require('../../routes/auth');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth Routes', () => {
  describe('POST /api/auth/login', () => {
    it('should return 400 if username is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ password: 'password123' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 if password is missing', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ username: 'testuser' });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 401 for invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'invaliduser',
          password: 'wrongpassword'
        });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/register', () => {
    it('should return 400 if required fields are missing', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 if password is less than 8 characters', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'short',
          role: 'patient',
          firstName: 'Test',
          lastName: 'User'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 400 if role is invalid', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123',
          role: 'invalidrole',
          firstName: 'Test',
          lastName: 'User'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/verify-token', () => {
    it('should return 400 if token is missing', async () => {
      const res = await request(app)
        .post('/api/auth/verify-token')
        .send({});

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 401 for invalid token', async () => {
      const res = await request(app)
        .post('/api/auth/verify-token')
        .send({ token: 'invalid-token' });

      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should return success message', async () => {
      const res = await request(app)
        .post('/api/auth/logout')
        .send({});

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('message');
    });
  });
});

