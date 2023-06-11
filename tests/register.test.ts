import supertest from 'supertest';
import app from '..';
import TestFactory, { User, users } from './TestFactory';

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
        .expect(403)
        .then(({ body }) => {
          expect(body).toEqual({
            message: 'Permission denied',
            type: 'PERMISSION_DENIED',
            payload: {},
          });
        });
    });

    it('should not allow for EMPLOYEE role', async () => {
      const token = await factory.login('EMPLOYEE');

      await request
        .post('/api/v1/register')
        .set('Cookie', `accessToken=${token}`)
        .send(data)
        .expect(403)
        .then(({ body }) => {
          expect(body).toEqual({
            message: 'Permission denied',
            type: 'PERMISSION_DENIED',
            payload: {},
          });
        });
    });
  });

  describe('Validation', () => {
    it('should not create employee with existing email', async () => {
      const token = await factory.login('ADMINISTRATOR');
      const user = users[2];
      const sendData = {
        ...data,
        email: user.email,
      };

      await request
        .post('/api/v1/register')
        .set('Cookie', `accessToken=${token}`)
        .send(sendData)
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({
            message: 'User with this email already exists',
            type: 'VALIDATION_ERROR',
            payload: {},
          });
        });
    });
  });

  describe('Register employee', () => {
    it('should create employee with boss in db', async () => {
      const token = await factory.login('ADMINISTRATOR');
      let userId;

      await request
        .post('/api/v1/register')
        .set('Cookie', `accessToken=${token}`)
        .send(data)
        .expect(200)
        .then(({ body }) => {
          userId = body.id;
        });

      const userInDb = await User.findByPk(userId);
      expect(userInDb).toBeDefined();
      expect(userInDb?.bossId).toBeDefined();
    });

    it('should not create employee without boss', async () => {
      const token = await factory.login('ADMINISTRATOR');
      const data = {
        firstName: 'Pavlo3',
        lastName: 'Vasylenko',
        email: 'pavlo3.vasylenko@kob.eu',
        password: 'passworD1!',
        confirmPassword: 'passworD1!',
        role: 'EMPLOYEE',
        bossId: null,
      };
      let userId;

      await request
        .post('/api/v1/register')
        .set('Cookie', `accessToken=${token}`)
        .send(data)
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({
            message: 'Must have boss',
            type: 'BAD_REQUEST',
            payload: {},
          });
        });
    });

    it('should update employee to boss if needed', async () => {
      const token = await factory.login('ADMINISTRATOR');
      const employee = users.find(
        (u) => u.id === '324c7499-c3cb-4878-9e1c-43c0caf8dcf7',
      );
      const data = {
        firstName: 'Pavlo4',
        lastName: 'Vasylenko',
        email: 'pavlo4.vasylenko@kob.eu',
        password: 'passworD1!',
        confirmPassword: 'passworD1!',
        role: 'EMPLOYEE',
        bossId: employee?.id,
      };

      await request
        .post('/api/v1/register')
        .set('Cookie', `accessToken=${token}`)
        .send(data)
        .expect(200)
        .then(({ body }) => {});

      const employeeInDb = await User.findByPk(employee?.id);
      expect(employeeInDb?.roleId).toEqual('BOSS');
    });
  });

  describe('Register boss', () => {
    it('should create boss with boss in db', async () => {
      const token = await factory.login('ADMINISTRATOR');
      const sendData = {
        firstName: 'Pavlo2',
        lastName: 'Vasylenko',
        email: 'pavlo5.vasylenko@kob.eu',
        password: 'passworD1!',
        confirmPassword: 'passworD1!',
        role: 'BOSS',
        bossId: '03c49263-9a0e-4aed-acdd-86d8ffc663b6',
      };
      let userId;

      await request
        .post('/api/v1/register')
        .set('Cookie', `accessToken=${token}`)
        .send(sendData)
        .expect(200)
        .then(({ body }) => {
          userId = body.id;
        });

      const userInDb = await User.findByPk(userId);
      expect(userInDb).toBeDefined();
      expect(userInDb?.roleId).toEqual('BOSS');
      expect(userInDb?.bossId).toBeDefined();
    });

    it('should create boss without boss in db', async () => {
      const token = await factory.login('ADMINISTRATOR');
      const sendData = {
        firstName: 'Pavlo2',
        lastName: 'Vasylenko',
        email: 'pavlo6.vasylenko@kob.eu',
        password: 'passworD1!',
        confirmPassword: 'passworD1!',
        role: 'BOSS',
        bossId: null,
      };
      let userId;

      await request
        .post('/api/v1/register')
        .set('Cookie', `accessToken=${token}`)
        .send(sendData)
        .expect(200)
        .then(({ body }) => {
          userId = body.id;
        });

      const userInDb = await User.findByPk(userId);
      expect(userInDb).toBeDefined();
      expect(userInDb?.roleId).toEqual('BOSS');
      expect(userInDb?.bossId).toBeNull();
    });
  })

  describe('Register administrator', () => {
    it('should create administrator without boss in db', async () => {
      const token = await factory.login('ADMINISTRATOR');
      const sendData = {
        firstName: 'Pavlo2',
        lastName: 'Vasylenko',
        email: 'pavlo7.vasylenko@kob.eu',
        password: 'passworD1!',
        confirmPassword: 'passworD1!',
        role: 'ADMINISTRATOR',
        bossId: null,
      };
      let userId;

      await request
        .post('/api/v1/register')
        .set('Cookie', `accessToken=${token}`)
        .send(sendData)
        .expect(200)
        .then(({ body }) => {
          userId = body.id;
        });

      const userInDb = await User.findByPk(userId);
      expect(userInDb).toBeDefined();
      expect(userInDb?.roleId).toEqual('ADMINISTRATOR');
      expect(userInDb?.bossId).toBeNull();
    });

    it('should create administrator without boss even if it is provided', async () => {
      const token = await factory.login('ADMINISTRATOR');
      const sendData = {
        firstName: 'Pavlo2',
        lastName: 'Vasylenko',
        email: 'pavlo8.vasylenko@kob.eu',
        password: 'passworD1!',
        confirmPassword: 'passworD1!',
        role: 'ADMINISTRATOR',
        bossId: '03c49263-9a0e-4aed-acdd-86d8ffc663b6',
      };
      let userId;

      await request
        .post('/api/v1/register')
        .set('Cookie', `accessToken=${token}`)
        .send(sendData)
        .expect(200)
        .then(({ body }) => {
          userId = body.id;
        });

      const userInDb = await User.findByPk(userId);
      expect(userInDb).toBeDefined();
      expect(userInDb?.roleId).toEqual('ADMINISTRATOR');
      expect(userInDb?.bossId).toBeNull();
    });
  })

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
