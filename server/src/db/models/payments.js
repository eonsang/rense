const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      models.Payment.belongsTo(models.User);
      models.Payment.hasOne(models.Order);
    }
  }

  Payment.init(
    {
      currency: {
        type: DataTypes.STRING(10),
        allowNull: false,
        require: true,
      },
      imp_uid: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
      },
      merchant_uid: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
      },
      paid_amount: {
        type: DataTypes.STRING(50),
        allowNull: false,
        require: true,
      },
      pay_method: {
        type: DataTypes.STRING(50),
        allowNull: false,
        require: true,
      },
      receipt_url: {
        type: DataTypes.STRING,
        allowNull: false,
        require: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true,
        require: false,
      },
      vbank_num: {
        // 가상계좌
        type: DataTypes.STRING,
        allowNull: true,
        require: false,
      },
      vbank_date: {
        // 가상계좌
        type: DataTypes.STRING,
        allowNull: true,
        require: false,
      },
      vbank_name: {
        // 가상계좌
        type: DataTypes.STRING,
        allowNull: true,
        require: false,
      },
    },
    {
      sequelize,
      modelName: "Payment",
    }
  );
  return Payment;
};
