import express from "express";
import {
  index,
  getCreate,
  postCreate,
  getDetail,
  postDetail,
  remove,
  jsonDetail,
} from "../../controllers/admin/options.controller";

import multer from "multer";
import path from "path";

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      return done(null, `uploads`);
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

router.get("/", index);
router.get("/create", getCreate);
router.post("/create", postCreate);
router.get("/detail/:id", getDetail);
router.post("/detail/:id", postDetail);

router.get("/json/:id", jsonDetail);

router.post("/remove/:id", remove);

export default router;
