import express from "express";
import { dashboard } from "../../controllers/admin/index.controller";
import routes from "../routes";

const router = express.Router();

router.get("/", dashboard);

export default router;
