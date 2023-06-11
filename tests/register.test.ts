import supertest from 'supertest';
import app from '..';
import TestFactory, { users } from './TestFactory';

const request = supertest.agent(app);
const factory = new TestFactory();

const data = {
  firstName: 'Pavlo2',
  lastName: 'Vasylenko',
  email: 'pavlo2.vasylenko@kob.eu',
  password: 'passworD1!',
  confirmPassword: 'passworD1!',
  role: 'EMPLOYEE',
  bossId: '03c49263-9a0e-4aed-acdd-86d8ffc663b6',
};

describe('Register service', () => {
  beforeAll(async () => {
    try {
      await factory.cleanUp();
      await factory.setDefaultUsers();
    } catch (e) {
      console.error(e);
      throw e;
    }
  });

  describe('Check permissions', () => {
    it('should not allow for BOSS role', async () => {
      const token = await factory.login('BOSS');

      await request
        .post('/api/v1/register')
        .set('Cookie', `accessToken=${token}`)
        .send(data)
        .expect(200)
        .then(({ body, headers }) => {
          console.log(body);
          
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
