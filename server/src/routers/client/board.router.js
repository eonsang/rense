import express from "express";
import { index, detail } from "../../controllers/client/board.controller";
import { isLoggedIn } from "../../middlewares/auth";

const router = express.Router();

router.get("/:name", isLoggedIn, index.get);
router.get("/:name/:id", isLoggedIn, detail);

export default router;
