import express from "express";
import multer from "multer";
import path from "path";

import {
  index,
  create,
  remove,
  detail,
  update,
  removeImage,
  removeOption,
  removeOptionDetail,
  removeChecked,
  changeUse,
  changeSoldout,
  removeOptionDia,
} from "../../controllers/admin/product.controller";

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

router.get("/", index);

router
  .route("/create")
  .get(create.get)
  .post(upload.array("thumbnail"), create.post);

router.route("/detail/:id").get(detail).post(upload.array("thumbnail"), update);

router.route("/remove/:id").post(remove);
router.route("/remove").post(removeChecked.post);

router.post("/image/delete/:id", removeImage);
router.post("/option/delete/:id", removeOption);
router.post("/optionDetail/delete/:id", removeOptionDetail);
router.post("/optionDetailDIA/delete/:id", removeOptionDia);

router.post("/detail/:id/use", changeUse);
router.post("/detail/:id/soldout", changeSoldout);

export default router;
