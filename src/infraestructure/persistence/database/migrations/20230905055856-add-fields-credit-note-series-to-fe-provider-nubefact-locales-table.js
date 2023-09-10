'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const columns = ['creditNoteSeriesToFactura', 'creditNoteSeriesToBoleta'];

    columns.forEach(async (column) => {
      await queryInterface.addColumn(
        {
          tableName: 'fe_provider_nubefact_locales',
          schema: 'sch_main',
        },
        column,
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
      );
    });

    return true;
  },

  async down() {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
