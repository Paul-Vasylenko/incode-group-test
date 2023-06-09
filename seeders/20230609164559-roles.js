'use strict';
const roles = require('../fixtures/roles.json');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Roles', roles, { returning: true });
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Roles', {});
  },
};
