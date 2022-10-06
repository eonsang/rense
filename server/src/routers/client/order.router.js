import express from "express";
import {
  order,
  detail,
  cancelOrder,
} from "../../controllers/client/order.controller";
import { isLoggedIn } from "../../middlewares/auth";
import multer from "multer";
import path from "path";
import {
  orderDetail,
  orderList,
} from "../../controllers/client/index.controller";

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

router.get("/", isLoggedIn, order.get);
router.post("/", isLoggedIn, upload.none(), order.post);

router.get("/detail/:id", isLoggedIn, detail);
router.post("/detail/:id", isLoggedIn, cancelOrder);

export default router;
