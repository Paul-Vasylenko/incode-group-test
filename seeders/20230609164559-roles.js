'use strict';
const roles = require('../fixtures/roles.json');
const users = require('../fixtures/users.json');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = 6;
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('Roles', roles, { returning: true });


    const hashedUsers = await Promise.all(users.map(async (u) => {
      const res = {
        ...u,
        passwordHash: await bcrypt.hash(u.password, SALT_ROUNDS),
      };

      delete res.password;
      return res;
    }));
    await queryInterface.bulkInsert('Users', hashedUsers, { returning: true });
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Roles', {});
    await queryInterface.bulkDelete('Users', {});
  },
};
