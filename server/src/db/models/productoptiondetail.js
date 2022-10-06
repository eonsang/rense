"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProductOptionDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.ProductOptionDetail.belongsTo(models.ProductOption, {
        onDelete: "cascade",
        foreignKey: {
          allowNull: false,
        },
      });
      models.ProductOptionDetail.hasMany(models.LensDiaOption, {
        onDelete: "cascade",
      });
    }
  }
  ProductOptionDetail.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      path: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      sold_out: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "ProductOptionDetail",
    }
  );
  return ProductOptionDetail;
};
