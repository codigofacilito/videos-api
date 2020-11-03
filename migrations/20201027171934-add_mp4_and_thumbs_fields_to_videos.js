'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn(
      'Videos', // table name
      'remoteMp4', // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );

    await queryInterface.addColumn(
      'Videos', // table name
      'thumbnail', // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );
      
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Videos', 'remoteMp4');
    await queryInterface.removeColumn('Videos', 'thumbnail');
  }
};
