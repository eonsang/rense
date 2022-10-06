import fs from "fs";
import path from "path";

import express from "express";

import localsMiddleware from "../../middlewares/locals";
import axios from "axios";
import PaymentService from "../../services/Payment.service";
import { Payment } from "../../db/models";

require("dotenv").config();

const PaymentInstance = new PaymentService(Payment);
const router = express.Router();
const indexJs = path.basename(__filename);

router.use(localsMiddleware);

router.post("/payment-hook", async (req, res) => {
  try {
    // eslint-disable-next-line camelcase
    const { imp_uid, merchant_uid } = req.body; // req의 body에서 imp_uid, merchant_uid 추출
    // 액세스 토큰(access token) 발급 받기
    const getToken = await axios({
      url: "https://api.iamport.kr/users/getToken",
      method: "post", // POST method
      headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
      data: {
        imp_key: process.env.IAMPORT_API_KEY,
        imp_secret: process.env.IAMPORT_API_SECRET_KEY,
      },
    });
    // eslint-disable-next-line camelcase
    const { access_token } = getToken.data.response; // 인증 토큰

    const getPaymentData = await axios({
      // eslint-disable-next-line camelcase
      url: `https://api.iamport.kr/payments/${imp_uid}`, // imp_uid 전달
      method: "get", // GET method
      headers: { Authorization: access_token }, // 인증 토큰 Authorization header에 추가
    });

    const paymentData = getPaymentData.data.response;
    const paymentDataByDb = await PaymentInstance.findByMerchantId(
      paymentData.merchant_uid
    );

    console.log("paymentDataByDb", paymentDataByDb);

    // eslint-disable-next-line camelcase
    const { paid_amount } = paymentDataByDb;
    const { amount, status } = paymentData;

    // eslint-disable-next-line camelcase

    console.log("status", status);
    console.log("amount", amount);
    console.log("paid_amount", paid_amount);

    if (amount === parseInt(paid_amount, 10)) {
      switch (status) {
        case "ready": // 가상계좌 발급
          const { vbank_num, vbank_date, vbank_name } = paymentData;
          const updatedPayment = await PaymentInstance.update(
            paymentDataByDb.id,
            {
              status,
              vbank_num,
              vbank_date,
              vbank_name,
            }
          );

          return res.send({
            status: "vbankIssued",
            message: "가상계좌 발급 성공",
          });
          break;
        case "paid": // 결제 완료
          await PaymentInstance.update(paymentDataByDb.id, {
            status: "paid",
          });
          return res.send({ status: "success", message: "일반 결제 성공" });
          break;
        default:
          break;
      }
    } else {
      // 결제 금액 불일치. 위/변조 된 결제
      throw { status: "forgery", message: "위조된 결제시도" };
    }
  } catch (e) {
    return res.status(400).send(e);
  }
});

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== indexJs &&
      file.slice(-9) === "router.js"
  )
  .forEach((routeFile) => {
    const pathName = routeFile.split(".")[0];
    return pathName === "index"
      ? router.use(`/`, require(`./${routeFile}`).default)
      : router.use(`/${pathName}`, require(`./${routeFile}`).default);
  });

export default router;
