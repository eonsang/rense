import express from "express";

import { detail } from "../../controllers/admin/user.controller";
import routes from "../routes";

const router = express.Router();

router.route("/:id").get(detail.get).post(detail.post);

export default router;
