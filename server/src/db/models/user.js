"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.User.hasMany(models.Qna, {
        onDelete: "cascade",
      });
      models.User.hasMany(models.Order);
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        // validate: {
        //   isEmail: true,
        // },
      },
      number: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      companyCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      companyAddrCode: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      companyAddr1: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      companyAddr2: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      companyAddr3: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      thumbnail: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      provider: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: "local",
      },
      snsId: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM,
        values: ["user", "manager", "admin"],
        defaultValue: "user",
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: true,
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
      paranoid: true,
      timestamps: true,
      underscored: false,
    }
  );
  return User;
};
