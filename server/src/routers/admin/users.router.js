import express from "express";

import {
  users,
  remove,
  create,
} from "../../controllers/admin/users.controller";
import routes from "../routes";

const router = express.Router();

router.route("/").get(users.get);

router.route("/delete").post(remove.post);

router.route("/create").get(create.get).post(create.post);

export default router;
