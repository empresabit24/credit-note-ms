'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable({
      tableName: 'credit_notes', 
      schema: 'sch_main' 
    }, {
      id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        autoIncrement: true,
        unique: true,
        primaryKey: true,
      },
      series: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      correlative: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      reason: {
        type: Sequelize.STRING,
        allowNull: false
      },
      observations: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable('credit_notes');
  }
};
