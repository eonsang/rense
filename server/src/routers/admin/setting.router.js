import express from "express";

import { setting } from "../../controllers/admin/setting.controller";
import routes from "../routes";
import multer from "multer";
import path from "path";

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      return done(null, `uploads/`);
    },
    filename(req, file, done) {
      const extname = path.extname(file.originalname);
      return done(
        null,
        path.basename(file.originalname, extname) + Date.now() + extname
      );
    },
  }),
});

router
  .route("/")
  .get(setting.get)
  .post(
    upload.fields([{ name: "og_image" }, { name: "favicon" }]),
    setting.post
  );
export default router;
