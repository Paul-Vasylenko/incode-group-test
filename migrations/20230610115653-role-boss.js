'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.addColumn(
        'Roles',
        'mayHaveBoss',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        { transaction },
      );
      await queryInterface.addColumn(
        'Roles',
        'mustHaveBoss',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
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
      await queryInterface.removeColumn('Roles', 'mayHaveBoss');
      await queryInterface.removeColumn('Roles', 'mustHaveBoss');

      await transaction.commit();
    } catch (e) {
      console.error('Migration error: ', e);
      await transaction.rollback();

      throw e;
    }
  },
};
