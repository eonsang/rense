import path from "path";
import fs from "fs";
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";
import nunjucks from "nunjucks";
import dateFilter from "nunjucks-date-filter";
import commaFilter from "nunjucks-comma-filter";
import passport from "passport";
import expressip from "express-ip";

import clientRouter from "./routers/client";
import adminRouter from "./routers/admin";
import { sequelize } from "./db/models";
import passportConfig from "./passport";
import routes from "./routers/routes";
import logger from "./loader/winston";
import createDefaultData from "./loader/createDefaultData";
import { isAdmin } from "./middlewares/auth";

require("dotenv").config();

const app = express();

passportConfig();

console.log('process.env.KAKAOMESSAGE_APIKEY', process.env.KAKAOMESSAGE_APIKEY);

const devForce = true;
const force = process.env.NODE_ENV === "production" ? false : devForce;
sequelize
  .sync({ force })
  .then(() => {
    console.log("DB connection success");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "njk");
const env = nunjucks.configure(path.join(__dirname, "views"), {
  express: app,
  watch: true,
});
env.addFilter("date", dateFilter);
env.addFilter("comma", commaFilter);

app.use(morgan("dev"));
app.use(expressip().getIpInfoMiddleware);
app.use("/static", express.static(path.join(__dirname, "static")));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
  res.locals.loginUser = req.user;
  next();
});

createDefaultData();
try {
  fs.readdirSync("uploads");
} catch (error) {
  fs.mkdirSync("uploads");
}
app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send("User-agent: *\nAllow: /\n");
});

app.use(routes.index, clientRouter);
app.use(routes.admin, isAdmin, adminRouter);
// main();

// error handler
app.use((req, res, next) => {
  const error = new Error(`Error`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.status = err.status || 500;
  res.locals.error = process.env.NODE_ENV !== "production" ? err : {};
  res.status(err.status || 500);
  logger.error("에러페이지");
  res.render("error");
});

export default app;
