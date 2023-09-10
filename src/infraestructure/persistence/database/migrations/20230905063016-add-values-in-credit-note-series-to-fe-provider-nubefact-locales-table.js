'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const tableName = 'fe_provider_nubefact_locales';
    const schema = 'sch_main';
    const locals = [
      {
        id: '1',
        creditNoteSeriesToFactura: 'FFF3',
        creditNoteSeriesToBoleta: 'BBB3',
      },
      {
        id: '2',
        creditNoteSeriesToFactura: 'FFF2',
        creditNoteSeriesToBoleta: 'BBB2',
      },
    ];

    const providerLocals = await queryInterface.sequelize.query(
      `SELECT * FROM ${schema}.${tableName}`,
    );

    providerLocals[0].forEach(async (providerLocal) => {
      const currentLocal = locals.find(
        (local) => providerLocal.idlocal === local.id,
      );
      await queryInterface.bulkUpdate(
        { tableName, schema },
        {
          creditNoteSeriesToFactura: currentLocal['creditNoteSeriesToFactura'],
          creditNoteSeriesToBoleta: currentLocal['creditNoteSeriesToBoleta'],
        },
        { idlocal: providerLocal.idlocal },
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
