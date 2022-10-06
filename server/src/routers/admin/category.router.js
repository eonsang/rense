import express from "express";

import {
  index,
  create,
  child,
  detail,
  update,
  remove,
} from "../../controllers/admin/category.controller";

const router = express.Router();

router.get("/", index);
router.get("/child", child);
router.get("/detail/:id", detail);
router.post("/detail/:id", update);
router.post("/delete/:id", remove);

router.route("/create").get(create.get).post(create.post);

export default router;
