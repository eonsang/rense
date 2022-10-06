"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SampleOption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.SampleOption.belongsTo(models.User, {
        onDelete: "cascade",
        foreignKey: {
          allowNull: false,
        },
      });
    }
  }
  SampleOption.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      objects: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "SampleOption",
    }
  );
  return SampleOption;
};
