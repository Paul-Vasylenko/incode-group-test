import User from '../../models/User';
import ApiError from '../../utils/errors';

class ListUsersService {
  listAll = async () => {
    return User.findAll();
  };

  listSubordinates = async (user: User) => {
    return user.getSubordinates();
  };
}

export default new ListUsersService();
