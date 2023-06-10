import User from '../../models/User';
import ApiError from '../../utils/errors';

class ListUsersService {
  listAll = async () => {
    return User.findAll();
  };

  getById = async (id: string) => {
    const user = await User.findByPk(id);

    if (!user)
      throw new ApiError({
        message: 'User not found',
        type: 'NOT_FOUND',
        status: 400,
      });

    return user;
  };

  listSubordinates = async (user: User) => {
    return user.getSubordinates();
  };
}

export default new ListUsersService();
