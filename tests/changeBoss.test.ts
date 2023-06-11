import supertest from 'supertest';
import app from '..';
import TestFactory, { User, users } from './TestFactory';
import { userService } from '../src/services';

const request = supertest.agent(app);
const factory = new TestFactory();

describe('Change boss service', () => {
  beforeAll(async () => {
    try {
      await factory.cleanUp();
      await factory.setDefaultUsers();
    } catch (e) {
      console.error(e);
      throw e;
    }
  });
  const employeeId = '324c7499-c3cb-4878-9e1c-43c0caf8dcf7';
  const oldBossId = '6426d8ab-2633-4339-8b2e-b351d5b5a4e8';
  const newBossId = '03c49263-9a0e-4aed-acdd-86d8ffc663b6';

  describe('Check permissions', () => {
    it('should be not allowed for employee', async () => {
      const token = await factory.login('EMPLOYEE');
      const data = {
        bossId: newBossId,
      };

      await request
        .patch(`/api/v1/users/${employeeId}`)
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

    // Add test so boss can not change boss not for his employee
  });

  describe('Validation', () => {
    it('should be not allowed to make administrator a boss', async () => {
      const token = await factory.login('ADMINISTRATOR');
      const data = {
        bossId: users.filter((u) => u.roleId === 'ADMINISTRATOR')[1].id,
      };

      await request
        .patch(`/api/v1/users/${employeeId}`)
        .set('Cookie', `accessToken=${token}`)
        .send(data)
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({
            message: 'This role may not have boss',
            type: 'BAD_REQUEST',
            payload: {},
          });
        });
    });
  });

  describe('Change boss', () => {
    beforeEach(async () => {
      const employee = await User.findById(employeeId);
      const oldBoss = await User.findById(oldBossId);
      const newBoss = await User.findById(newBossId);
      employee.roleId = 'EMPLOYEE';
      employee.bossId = oldBossId;
      oldBoss.roleId = 'BOSS';
      newBoss.roleId = 'EMPLOYEE';
      newBoss.bossId = oldBossId;

      await Promise.all([employee.save(), oldBoss.save(), newBoss.save()]);
    });
    it('should change boss', async () => {
      const token = await factory.login('ADMINISTRATOR');
      const data = {
        bossId: newBossId,
      };

      await request
        .patch(`/api/v1/users/${employeeId}`)
        .set('Cookie', `accessToken=${token}`)
        .send(data)
        .expect(200);

      const employee = await User.findByPk(employeeId);
      expect(employee?.bossId).toEqual(newBossId);
    });

    it('should change role for new boss (from employee to boss)', async () => {
      const token = await factory.login('ADMINISTRATOR');
      const data = {
        bossId: newBossId,
      };

      await request
        .patch(`/api/v1/users/${employeeId}`)
        .set('Cookie', `accessToken=${token}`)
        .send(data)
        .expect(200);

      const newBoss = await User.findByPk(newBossId);
      expect(newBoss?.roleId).toEqual('BOSS');
    });

    it('should change role for old boss (to employee)', async () => {
      const token = await factory.login('ADMINISTRATOR');
      await factory.leaveOnlyOneSubordinate(oldBossId, employeeId);
      const data = {
        bossId: newBossId,
      };

      await request
        .patch(`/api/v1/users/${employeeId}`)
        .set('Cookie', `accessToken=${token}`)
        .send(data)
        .expect(200);

      const oldBoss = await User.findByPk(oldBossId);
      expect(oldBoss?.roleId).toEqual('EMPLOYEE');
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
