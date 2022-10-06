"use strict";

/**
 * @author Henry Kim <henry@nurigo.net>
 */

const moment = require("moment");
const HmacSHA256 = require("crypto-js/hmac-sha256");
require("dotenv").config();
const config = {
  apiKey: process.env.KAKAOMESSAGE_APIKEY,
  apiSecret: process.env.KAKAOMESSAGE_APISECRET,
  accessToken: "",
  to: "",
  from: `${process.env.TALK_FORM_NUMBER}`,
};
let { apiKey, apiSecret, accessToken, to, from } = config;
module.exports = {
  getAuth(headerType = getHeaderType()) {
    switch (headerType) {
      case 1:
        const date = moment.utc().format();
        const salt = "aklsdnglkaenglkasdnvlkasdnvlaksdnklasngoiaweng";
        const hmacData = date + salt;
        const signature = HmacSHA256(hmacData, apiSecret).toString();
        return `HMAC-SHA256 apiKey=${apiKey}, date=${date}, salt=${salt}, signature=${signature}`;
      case 2:
        return `Bearer ${accessToken}`;
      default:
        throw new Error(
          "문자메시지를 전송하기 위해서는 액세스토큰 또는 API_KEY, API_SECRET이 필요합니다."
        );
    }
  },
  getFrom() {
    return from;
  },
  getTo() {
    return to;
  },
  init(config) {
    apiKey = config.apiKey;
    apiSecret = config.apiSecret;
    accessToken = config.accessToken;
    to = config.to;
    from = config.from;
  },
};

function getHeaderType() {
  if (apiKey && apiSecret) return 1;
  else if (accessToken) return 2;
  return 0;
}
