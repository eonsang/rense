import express from "express";
import {
  index,
  thumbnail,
  getAddr,
} from "../../controllers/client/mypage.controller";
import { isLoggedIn } from "../../middlewares/auth";
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

router.route("/").get(isLoggedIn, index.get).post(isLoggedIn, index.post);

router.get("/address", isLoggedIn, getAddr);

router.post(
  "/thumbnail",
  isLoggedIn,
  upload.single("thumbnail"),
  thumbnail.post
);

export default router;
