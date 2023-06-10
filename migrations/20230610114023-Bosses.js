'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.addColumn(
        'Users',
        'bossId',
        {
          type: Sequelize.UUID,
          references: {
            model: 'Users',
            key: 'id',
          },
          allowNull: true,
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
      await queryInterface.removeColumn('Users', 'bossId');

      await transaction.commit();
    } catch (e) {
      console.error('Migration error: ', e);
      await transaction.rollback();

      throw e;
    }
  },
};
