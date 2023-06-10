import sequelize from '../../../db';
import { RegisterSchema } from '../../controllers/users/schema';
import Role from '../../models/Role';
import User, { UserCreateData } from '../../models/User';
import { encrypt, generateTokens } from '../../utils';
import ApiError from '../../utils/errors';

class RegisterService {
  async validateRegisterData(registerData: RegisterSchema) {
    const existingUser = await User.findOne({
      where: {
        email: registerData.email,
      },
      include: [{ model: Role, as: 'role' }],
    });

    if (existingUser)
      throw new ApiError({
        message: 'User with this email already exists',
        status: 400,
        type: 'VALIDATION_ERROR',
      });
    const roleExists = await Role.findById(registerData.role);

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
      throw new ApiError({
        message: 'Must have boss',
        status: 400,
        type: 'BAD_REQUEST',
      });
    const user = new User(createData);

    return user.save();
  }
}

export default new RegisterService();
