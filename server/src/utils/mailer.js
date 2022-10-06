import nodemailer from "nodemailer";
import smtpTransporter from "nodemailer-smtp-transport";

require("dotenv").config();

const smtpTransport = nodemailer.createTransport(
  smtpTransporter({
    service: process.env.SERVICE,
    host: process.env.MAIL_HOST,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  })
);

export default smtpTransport;
