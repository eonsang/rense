"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Qna extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Qna.belongsTo(models.User, {
        onDelete: "cascade",
        foreignKey: {
          allowNull: false,
        },
      });
    }
  }
  Qna.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      is_secret: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      receive_email: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      receive_sms: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      receive_talk: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_ip: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reply_user: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      reply_datetime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      reply_content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      reply_created_ip: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Qna",
    }
  );
  return Qna;
};
