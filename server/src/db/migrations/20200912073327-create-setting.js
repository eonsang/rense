"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Settings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      favicon: {
        type: Sequelize.STRING,
      },
      keyword: {
        type: Sequelize.STRING,
      },
      og_image: {
        type: Sequelize.STRING,
      },
      og_url: {
        type: Sequelize.STRING,
      },
      og_description: {
        type: Sequelize.STRING,
      },
      og_title: {
        type: Sequelize.STRING,
      },
      company_name: {
        type: Sequelize.STRING,
      },
      company_owner: {
        type: Sequelize.STRING,
      },
      company_register_number: {
        type: Sequelize.STRING,
      },
      company_tel: {
        type: Sequelize.STRING,
      },
      company_fax: {
        type: Sequelize.STRING,
      },
      company_address: {
        type: Sequelize.STRING,
      },
      company_address_code: {
        type: Sequelize.STRING,
      },
      company_information_manager: {
        type: Sequelize.STRING,
      },
      company_information_manager_email: {
        type: Sequelize.STRING,
      },
      add_meta: {
        type: Sequelize.TEXT,
      },
      add_script: {
        type: Sequelize.TEXT,
      },
      use_email_certify: {
        type: Sequelize.BOOLEAN,
      },
      privacy: {
        type: Sequelize.TEXT,
      },
      stipulation: {
        type: Sequelize.TEXT,
      },
      terms1: {
        type: Sequelize.TEXT,
      },
      terms2: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable("Settings");
  },
};
