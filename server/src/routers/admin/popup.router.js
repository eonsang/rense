import express from "express";
import multer from "multer";
import path from "path";

import {
  popup,
  popupImage,
  create,
  detail,
  remove,
} from "../../controllers/admin/popup.controller";
import routes from "../routes";

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

router.route("/").get(popup.get);

router.get("/detail/:id", detail.get);
router.post("/detail/:id", upload.single("file"), detail.post);

router.post("/remove/:id", remove.post);

router
  .route("/create")
  .get(create.get)
  .post(upload.single("file"), create.post);

export default router;
