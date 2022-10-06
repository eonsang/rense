import { Payment } from "../../db/models";
import PaymentService from "../../services/Payment.service";

const PaymentInstance = new PaymentService(Payment);

require("dotenv").config();

export const create = async (req, res, next) => {
  try {
    const result = await PaymentInstance.create({
      ...req.body,
      UserId: req.user.id,
    });
    console.log(result);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
