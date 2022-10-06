"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Cart.belongsTo(models.User, {
        onDelete: "cascade",
        foreignKey: {
          allowNull: false,
        },
      });
      models.Cart.belongsTo(models.Product, {
        onDelete: "cascade",
        foreignKey: {
          allowNull: false,
        },
      });
      models.Cart.belongsTo(models.ProductOption, {
        foreignKey: {
          allowNull: true,
        },
      });
      models.Cart.belongsTo(models.ProductOptionDetail, {
        foreignKey: {
          allowNull: true,
        },
      });
      models.Cart.belongsTo(models.Order, {
        foreignKey: {
          allowNull: true,
        },
      });
    }
  }
  Cart.init(
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      lens_option: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_payment: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      order_obj: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Cart",
    }
  );
  return Cart;
};
