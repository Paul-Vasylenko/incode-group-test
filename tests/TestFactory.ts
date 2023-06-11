import sequelize from '../db';
import users from '../fixtures/users.json';
import roles from '../fixtures/roles.json';
import User from '../src/models/User';
import { encrypt, getAccessToken } from '../src/utils';
import Role from '../src/models/Role';

export { sequelize, users, roles, User, Role };

export default class TestFactory {
  public async cleanUp() {
    await this.dropDatabase();
  }

  public closeConnection() {
    return sequelize.close();
  }

  private async dropDatabase() {
    const tables = ['Roles', 'Users'];

    await sequelize.query(
      `TRUNCATE TABLE ${tables
        .map((m) => `"${m}"`)
        .join(', ')} restart identity CASCADE;`,
    );
  }

  async setDefaultUsers({ hashPassword = true } = {}): Promise<
    User[] | undefined
  > {
    try {
      await Role.bulkCreate(roles);
      const userMap = await Promise.all(
        users.map(async (u) => ({
          id: u.id,
          roleId: u.roleId,
          firstName: u.password,
          lastName: u.lastName,
          email: u.email,
          passwordHash: hashPassword ? await encrypt(u.password) : u.password,
          bossId: u.bossId,
          createdAt: u.createdAt as unknown as Date,
          updatedAt: u.updatedAt as unknown as Date,
        })),
      );

      return User.bulkCreate(userMap);
    } catch (e) {
      console.log(e);
    }

    return;
  }

  async login(role: string) {
    const user = await User.findOne({
      where: {
        roleId: role,
      },
    });

    if (!user) throw new Error('User not found');

    return getAccessToken(user);
  }
}
