import express from "express";
import {
  cart,
  all,
  add,
  quantityChange,
  remove,
  clear,
} from "../../controllers/client/cart.controller";
import { isLoggedIn } from "../../middlewares/auth";
import multer from "multer";
import path from "path";

const router = express.Router();

router.get("/", isLoggedIn, cart.get);
router.post("/", isLoggedIn, cart.post);

router.get("/all", isLoggedIn, all);

router.post("/clear", isLoggedIn, clear);

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

router.post("/add", isLoggedIn, upload.none(), add);

router.post("/quantity/:id", isLoggedIn, upload.none(), quantityChange);

router.post("/delete/:id", isLoggedIn, upload.none(), remove);

export default router;
