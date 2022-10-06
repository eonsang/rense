import express from "express";
import {
  index,
  detail,
  remove,
  update,
  create,
} from "../../controllers/client/qna.controller";

import { isLoggedIn } from "../../middlewares/auth";

const router = express.Router();

router.get("/", index.get);
router.get("/detail/:id", detail.get);

router.get("/create", isLoggedIn, create.get);

router.post("/create", isLoggedIn, create.post);

router.get("/update/:id", isLoggedIn, update.get);
router.post("/update/:id", isLoggedIn, update.post);

router.post("/remove/:id", isLoggedIn, remove.post);

export default router;
