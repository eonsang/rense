"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Qnas", {
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
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      is_secret: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      receive_email: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      receive_sms: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      receive_talk: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_ip: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      reply_user: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      reply_datetime: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      reply_content: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      reply_created_ip: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable("Qnas");
  },
};
