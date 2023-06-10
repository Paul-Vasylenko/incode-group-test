import sequelize from '../../../db';
import { RegisterSchema } from '../../controllers/users/schema';
import Role from '../../models/Role';
import User, { UserCreateData } from '../../models/User';
import { encrypt, generateTokens } from '../../utils';

class RegisterService {
  async validateRegisterData(registerData: RegisterSchema) {
    const existingUser = await User.findOne({
      where: {
        email: registerData.email,
      },
      include: [{ model: Role, as: 'role' }],
    });

    if (existingUser) throw new Error('User with this email already exists');

    const roleExists = await Role.findByPk(registerData.role);

    if (!roleExists) throw new Error('Role does not exists');

    return roleExists;
  }

  async register(registerData: RegisterSchema): Promise<User> {
    const createData: UserCreateData = {
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      email: registerData.email,
      passwordHash: await encrypt(registerData.password),
      roleId: registerData.role,
      bossId: registerData.bossId,
    };
    const role = await Role.findById(registerData.role);
    if (!role.mayHaveBoss) createData.bossId = null;
    if (role.mustHaveBoss && !createData.bossId)
      throw new Error('Must have boss');
    const user = new User(createData);

    return user.save();
  }
}

export default new RegisterService();
