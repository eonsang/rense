import express from "express";

import {
  index,
  remove,
  detail,
  update,
} from "../../controllers/admin/qna.controller";
import routes from "../routes";

const router = express.Router();

router.get("/", index);

router.get("/detail/:id", detail.get);

router.post("/update/:id", update.post);

router.post("/remove/:id", remove.post);

export default router;
