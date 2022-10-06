"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Orders", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      memo: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      zipcode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      addr1: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      addr2: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      addr3: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Orders");
  },
};
