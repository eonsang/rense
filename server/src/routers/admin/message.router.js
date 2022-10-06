import express from "express";

import { index } from "../../controllers/admin/message.controller";

const router = express.Router();

router.route("/").get(index.get).post(index.post);

export default router;
