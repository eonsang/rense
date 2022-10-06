import express from "express";
import { create } from "../../controllers/client/payment.controller";
import { isLoggedIn } from "../../middlewares/auth";

const router = express.Router();

router.post("/", isLoggedIn, create);

export default router;
