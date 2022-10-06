"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Popup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Popup.hasMany(models.PopupImage, {
        onDelete: "cascade",
      });
    }
  }

  Popup.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      position_x: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      position_y: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      link: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      target_blank: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      width: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 500,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Popup",
    }
  );
  return Popup;
};
