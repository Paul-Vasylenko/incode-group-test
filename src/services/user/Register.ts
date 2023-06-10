import sequelize from '../../../db';
import { RegisterSchema } from '../../controllers/users/schema';
import User from '../../models/User';
import { encrypt, generateTokens } from '../../utils';

class RegisterService {
  async validateRegisterData(registerData: RegisterSchema) {
    const existingUser = await User.findOne({
      where: {
        email: registerData.email,
      },
      include: [{ model: sequelize.models.Role, as: 'role' }], // using sequelize to prevent many imports of models
    });

    if (existingUser) throw new Error('User with this email already exists');

    const roleExists = await sequelize.models.Role.findByPk(registerData.role);

    if (!roleExists) throw new Error('Role does not exists');
  }

  async register(registerData: RegisterSchema): Promise<User> {
    const user = new User({
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      email: registerData.email,
      passwordHash: await encrypt(registerData.password),
      roleId: registerData.role,
    });

    return user.save();
  }
}

export default new RegisterService();
