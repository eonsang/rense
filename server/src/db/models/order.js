"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // 작성자
      models.Order.belongsTo(models.User, {
        onDelete: "cascade",
        foreignKey: {
          allowNull: false,
        },
      });

      // 담당자
      models.Order.belongsTo(models.User, {
        onDelete: "cascade",
        foreignKey: {
          name: "manager",
          allowNull: true,
        },
      });

      models.Order.belongsTo(models.Payment, {
        onDelete: "cascade",
        foreignKey: {
          allowNull: true,
        },
      });
      models.Order.hasMany(models.Cart);
    }
  }

  Order.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      memo: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      zipcode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      addr1: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      addr2: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      addr3: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_send: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_paid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_cancel: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_state: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: true,
      },
      total_price: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: false,
      },
      paid_price: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: false,
      },
      balance_price: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
