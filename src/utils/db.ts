import sequelize from '../../db';

export const getTransaction = () => {
  return sequelize.transaction();
};
