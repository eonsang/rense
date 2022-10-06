"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Setting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Setting.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "사이트이름",
      },
      keyword: DataTypes.STRING,
      favicon: DataTypes.STRING,
      og_image: DataTypes.STRING,
      og_url: DataTypes.STRING,
      og_description: DataTypes.STRING,
      og_title: DataTypes.STRING,
      add_meta: DataTypes.TEXT,
      add_script: DataTypes.TEXT,
      company_name: DataTypes.STRING,
      company_owner: DataTypes.STRING,
      company_register_number: DataTypes.STRING,
      company_tel: DataTypes.STRING,
      company_fax: DataTypes.STRING,
      company_address: DataTypes.STRING,
      company_address_code: DataTypes.STRING,
      company_information_manager: DataTypes.STRING,
      company_information_manager_email: DataTypes.STRING,
      use_email_certify: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      privacy: DataTypes.TEXT,
      stipulation: DataTypes.TEXT,
      terms1: DataTypes.TEXT,
      terms2: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Setting",
    }
  );
  return Setting;
};
