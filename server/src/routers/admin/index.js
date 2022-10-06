import fs from "fs";
import path from "path";

import express from "express";

import localsMiddleware from "../../middlewares/locals";

const router = express.Router();
const indexJs = path.basename(__filename);

router.use(localsMiddleware);

fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 &&
      file !== indexJs &&
      file.slice(-9) === "router.js"
  )
  .forEach((routeFile) => {
    const pathName = routeFile.split(".")[0];
    if (pathName === "index") {
      return router.use(`/`, require(`./${routeFile}`).default);
    }
    return router.use(`/${pathName}`, require(`./${routeFile}`).default);
  });

export default router;
