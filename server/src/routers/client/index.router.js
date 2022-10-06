import express from "express";
import {
  index,
  orderDetail,
  orderList,
  product,
  item,
} from "../../controllers/client/index.controller";
import { isLoggedIn } from "../../middlewares/auth";

const router = express.Router();

router.get("/", index.get);

router.get("/product/:id", isLoggedIn, product.get);

router.get("/item/:id", item.get);
router.post("/item/:id", isLoggedIn, item.post);

router.get("/showImage", (req, res, next) => {
  const { path } = req.query;
  return res.render("showImage", {
    path,
  });
});

router.get("/private", (req, res, next) => {
  return res.render("private");
});

router.get("/orderinfo", (req, res, next) => {
  return res.render("orderInfo");
});

router.get("/terms", (req, res, next) => {
  return res.render("terms");
});

export default router;
