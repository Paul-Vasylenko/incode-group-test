import sequelize from '../../../db';
import { LoginSchema } from '../../controllers/users/schema';
import User from '../../models/User';
import { compare, generateTokens } from '../../utils';
import ApiError from '../../utils/errors';

class LoginService {
  async validateLoginData(loginData: LoginSchema): Promise<User> {
    const existingUser = await User.findOne({
      where: {
        email: loginData.email,
      },
      include: [{ model: sequelize.models.Role, as: 'role' }], // using sequelize to prevent many imports of models
    });

    if (!existingUser)
      throw new ApiError({
        message: 'User with this email does not exist',
        type: 'VALIDATION_ERROR',
        status: 400,
      });

    const passwordCorrect = await compare(
      loginData.password,
      existingUser.passwordHash,
    );
    if (!passwordCorrect)
      throw new ApiError({
        message: 'Incorrect password',
        status: 400,
        type: 'BAD_REQUEST',
      });

    return existingUser;
  }

  async login(user: User) {
    return generateTokens(user);
  }
}

export default new LoginService();
