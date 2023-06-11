import supertest from 'supertest';
import app from '..';
import TestFactory, { User, users } from './TestFactory';
import { userService } from '../src/services';

const request = supertest.agent(app);
const factory = new TestFactory();

describe('List users service', () => {
  beforeAll(async () => {
    try {
      await factory.cleanUp();
      await factory.setDefaultUsers();
    } catch (e) {
      console.error(e);
      throw e;
    }
  });

  describe('Employee list users', () => {
    it('should see only himself', async () => {
      const token = await factory.login('EMPLOYEE');
      const me = factory.getUserFromToken(token);

      await request
        .get('/api/v1/users')
        .set('Cookie', `accessToken=${token}`)
        .expect(200)
        .then(({ body }) => {
          expect(body.meta.total).toEqual(1);
          expect(body.data.length).toEqual(1);
          const user = body.data[0];

          expect(user.id).toEqual(me.id);
        });
    });
  });

  describe('Boss list users', () => {
    beforeAll(async () => {
      const user = await User.findByPk('324c7499-c3cb-4878-9e1c-43c0caf8dcf7');
      if (!user) throw new Error('Not found');

      await userService.changeBoss(
        user,
        '03c49263-9a0e-4aed-acdd-86d8ffc663b6',
      );
    });
    it('should see only himself and subordinates (recursively)', async () => {
      const token = await factory.login('BOSS');
      const me = factory.getUserFromToken(token);

      function checkEmployeeBossChain(users: User[], bossId: string) {
        // add set of checked users or index
        // const notSubordinates = users.filter(u => u.bossId !== bossId);
        // notSubordinates.forEach(u => u.roleId === 'BOSS' && checkSubordinates(notSubordinates, u.id));
      }

      await request
        .get('/api/v1/users')
        .set('Cookie', `accessToken=${token}`)
        .expect(200)
        .then(({ body }) => {
          const users: User[] = body.data;
          expect(users[0].id).toEqual(me.id);
          // For recursive check
          /**
           * map will look like 
           * 
           * {
                '6426d8ab-2633-4339-8b2e-b351d5b5a4e8': [ '03c49263-9a0e-4aed-acdd-86d8ffc663b6' ],
                '03c49263-9a0e-4aed-acdd-86d8ffc663b6': [ '324c7499-c3cb-4878-9e1c-43c0caf8dcf7' ],
                '324c7499-c3cb-4878-9e1c-43c0caf8dcf7': []
            }
           */
          const map: Record<string, string[]> = users.reduce(
            (prev, curr) => ({
              ...prev,
              [curr.id]: users
                .filter((u) => u.bossId === curr.id)
                .map((u) => u.id),
            }),
            {},
          );

          function findRoot(id: string) {
            for (const userId of Object.keys(map)) {
              if (map[userId].includes(id)) return userId;
            }

            return '';
          }

          for (const userId of Object.keys(map)) {
            if (map[userId].length) continue; // only for employees

            let id: string = userId;
            let i = 0;
            // i only for not crashing test with recursion
            while (id !== me.id && i !== 10) {
              id = findRoot(id);
              i++;
            }

            expect(id).toEqual(me.id);
          }
        });
    });
  });

  describe('Administrator list users', () => {
    it('should see everyone', async () => {
      const token = await factory.login('ADMINISTRATOR');
      const me = factory.getUserFromToken(token);

      await request
        .get('/api/v1/users')
        .set('Cookie', `accessToken=${token}`)
        .expect(200)
        .then(({ body }) => {
          const roles = body.data.map((u: User) => u.roleId);
          const ids = body.data.map((u: User) => u.id);

          expect(roles).toContain('ADMINISTRATOR');
          expect(roles).toContain('BOSS');
          expect(roles).toContain('EMPLOYEE');
          expect(ids).toContain(me.id);
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
