import supertest from 'supertest';
import app from '..';
import TestFactory, { users } from './TestFactory';

const request = supertest.agent(app);
const factory = new TestFactory();

describe('Login service', () => {
  beforeAll(async () => {
    try {
      await factory.cleanUp();
      await factory.setDefaultUsers();
    } catch (e) {
      console.error(e);
      throw e;
    }
  });

  describe('given correct credentials', () => {
    it('should login administrator and set tokens', async () => {
      const admin = users.find((u) => u.roleId === 'ADMINISTRATOR');

      const data = {
        email: admin?.email,
        password: admin?.password,
      };

      await request
        .post('/api/v1/login')
        .send(data)
        .expect(200)
        .then(({ body, headers }) => {
          expect(body.user.email).toEqual(data.email);
          expect(body.user.role.id).toEqual('ADMINISTRATOR');
          const cookies = headers['set-cookie'];
          const accessTokenCookie = cookies.find((cookie: string) =>
            cookie.includes('accessToken'),
          );
          const refreshTokenCookie = cookies.find((cookie: string) =>
            cookie.includes('refreshToken'),
          );

          expect(accessTokenCookie).toBeDefined();
          expect(refreshTokenCookie).toBeDefined();
        });
    });
    it('should login boss and set tokens', async () => {
      const boss = users.find((u) => u.roleId === 'BOSS');

      const data = {
        email: boss?.email,
        password: boss?.password,
      };

      await request
        .post('/api/v1/login')
        .send(data)
        .expect(200)
        .then(({ body, headers }) => {
          expect(body.user.email).toEqual(data.email);
          expect(body.user.role.id).toEqual('BOSS');
          const cookies = headers['set-cookie'];
          const accessTokenCookie = cookies.find((cookie: string) =>
            cookie.includes('accessToken'),
          );
          const refreshTokenCookie = cookies.find((cookie: string) =>
            cookie.includes('refreshToken'),
          );

          expect(accessTokenCookie).toBeDefined();
          expect(refreshTokenCookie).toBeDefined();
        });
    });
    it('should login employee and set tokens', async () => {
      const employee = users.find((u) => u.roleId === 'EMPLOYEE');

      const data = {
        email: employee?.email,
        password: employee?.password,
      };

      await request
        .post('/api/v1/login')
        .send(data)
        .expect(200)
        .then(({ body, headers }) => {
          expect(body.user.email).toEqual(data.email);
          expect(body.user.role.id).toEqual('EMPLOYEE');
          const cookies = headers['set-cookie'];
          const accessTokenCookie = cookies.find((cookie: string) =>
            cookie.includes('accessToken'),
          );
          const refreshTokenCookie = cookies.find((cookie: string) =>
            cookie.includes('refreshToken'),
          );

          expect(accessTokenCookie).toBeDefined();
          expect(refreshTokenCookie).toBeDefined();
        });
    });
  });

  describe('given wrong credentials', () => {
    it('should not login', async () => {
      const data = {
        email: 'wrongemail@mail.com',
        password: 'qwertY1!d',
      };

      await request
        .post('/api/v1/login')
        .send(data)
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({
            message: 'User with this email does not exist',
            type: 'VALIDATION_ERROR',
            payload: {},
          });
        });
    });
  });

  afterAll(async () => {
    try {
      await factory.cleanUp();
      await factory.closeConnection();
    } catch (e) {
      console.error(e);
      throw e;
    }
  });
});
