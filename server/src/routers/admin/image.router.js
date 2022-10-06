import express from "express";

import { single } from "../../controllers/admin/image.controller";
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

router.route("/editor").post(upload.single("file"), single);

export default router;
