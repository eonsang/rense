import express from "express";

import {
  index,
  create,
  detail,
  update,
  remove,
  removeChecked,
} from "../../controllers/admin/board.controller";
import multer from "multer";
import path from "path";

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      return done(null, `uploads`);
    },
    filename(req, file, done) {
      const extname = path.extname(file.originalname);
      return done(
        null,
        path.basename(file.originalname, extname) + Date.now() + extname
      );
    },
  }),
});

router.get("/:name", index);

router.get("/:name/detail/:id", detail);
router.post("/:name/detail/:id", upload.none(), update);

router.post("/:name/delete/:id", upload.none(), remove);
router.post("/:name/delete", upload.none(), removeChecked.post);

router.get("/:name/create", create.get);
router.post("/:name/create", upload.none(), create.post);

export default router;
