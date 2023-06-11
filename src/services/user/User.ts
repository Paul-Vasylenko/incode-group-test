import Role from '../../models/Role';
import User from '../../models/User';
import ApiError from '../../utils/errors';

class UserUseService {
  async changeRole(idOrUser: string | User, role: string): Promise<void> {
    let user: User | null = null;

    if (typeof idOrUser === 'string') {
      user = await User.findByPk(idOrUser);

      if (!user) {
        throw new ApiError({
          message: 'User does not exist',
          type: 'NOT_FOUND',
          status: 404,
        });
      }
    } else {
      user = idOrUser;
    }

    user.roleId = role;
    await user.save();
  }

  async validateBecomeBoss(bossId: string) {
    const newBoss = await this.getById(bossId);
    if (!newBoss.role.mayHaveBoss)
      throw new ApiError({
        message: 'This role may not have boss',
        type: 'BAD_REQUEST',
        status: 400,
      });

    return newBoss;
  }

  async changeBoss(user: User, bossId: string) {
    const oldBoss = user.boss;
    user.bossId = bossId;

    await user.save(); // update boss for provided user
    await this.changeRole(bossId, 'BOSS'); // give boss correct new role (if it was not before)

    oldBoss && (await this.validateBossRole(oldBoss)); // check if old boss is still boss, or just an employee
  }

  async validateBossRole(user: User) {
    const hasSubordinates = await User.findAll({
      where: {
        bossId: user.id,
      },
    });

    if (!hasSubordinates.length) {
      await this.changeRole(user, 'EMPLOYEE');
    }
  }

  getById = async (id: string) => {
    const user = await User.findByPk(id, {
      include: [
        { model: User, as: 'boss' },
        { model: Role, as: 'role' },
      ],
    });

    if (!user)
      throw new ApiError({
        message: 'User not found',
        type: 'NOT_FOUND',
        status: 400,
      });

    return user;
  };
}

export default new UserUseService();
