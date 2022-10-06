"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Popups", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      position_x: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      width: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 500,
      },
      position_y: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      link: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      target_blank: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.dropTable("Popups");
  },
};
