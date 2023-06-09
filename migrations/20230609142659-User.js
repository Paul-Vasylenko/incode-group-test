'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable('Users', {
        id : { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true }
      }, { transaction });

      await transaction.commit();
    } catch(e) {
      console.error("Migration error: ", e);
      await transaction.rollback();

      throw e;
    }
  },

  async down (queryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.dropTable('Users', { transaction });

      await transaction.commit();
    } catch(e) {
      console.error("Migration error: ", e);
      await transaction.rollback();

      throw e;
    }
  }
};