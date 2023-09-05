'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.bulkUpdate(
      {
        tableName: 'fe_provider_nubefact_locales',
        schema: 'sch_main',
      },
      {
        creditNoteSeries: 'FFF1',
      },
      {
        idlocal: 2,
      },
    );
  },

  async down() {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
