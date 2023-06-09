'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(
        'Users',
        {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
          },
          firstName: { type: Sequelize.STRING, allowNull: false },
          lastName: { type: Sequelize.STRING, allowNull: false },
          email: { type: Sequelize.STRING, allowNull: false },
          passwordHash: { type: Sequelize.STRING, allowNull: false },
          createdAt: { type: Sequelize.DATE, allowNull: false },
          updatedAt: { type: Sequelize.DATE, allowNull: false },
          deletedAt: { type: Sequelize.DATE, allowNull: true },
        },
        { transaction },
      );

      await transaction.commit();
    } catch (e) {
      console.error('Migration error: ', e);
      await transaction.rollback();

      throw e;
    }
  },

  async down(queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.dropTable('Users', { transaction });

      await transaction.commit();
    } catch (e) {
      console.error('Migration error: ', e);
      await transaction.rollback();

      throw e;
    }
  },
};
