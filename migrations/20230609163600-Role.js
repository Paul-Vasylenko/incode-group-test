'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable(
        'Roles',
        {
          id: {
            type: Sequelize.STRING,
            primaryKey: true,
          },
          name: { type: Sequelize.STRING, allowNull: false },
          permissions: {
            type: Sequelize.ARRAY(Sequelize.STRING),
            allowNull: false,
          },
        },
        { transaction },
      );

      await queryInterface.addColumn(
        'Users',
        'roleId',
        {
          type: Sequelize.STRING,
          onDelete: 'CASCADE',
          references: {
            model: 'Roles',
            key: 'id',
          },
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
      await queryInterface.removeColumn('Users', 'roleId');
      await queryInterface.dropTable('Roles', { transaction });

      await transaction.commit();
    } catch (e) {
      console.error('Migration error: ', e);
      await transaction.rollback();

      throw e;
    }
  },
};
