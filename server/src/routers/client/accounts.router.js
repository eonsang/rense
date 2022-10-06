import express from "express";

import {
  login,
  logout,
  signup,
  complete,
  vertify,
  kakao,
  kakaoCallback,
  naver,
  naverCallback,
  snsLoginRedirectHome,
  checkCompanyCode,
  checkEmail,
  checkNumber
} from "../../controllers/client/accounts.controller";
import routes from "../routes";
import { isNotLoggedIn, isLoggedIn } from "../../middlewares/auth";

const router = express.Router();

router
  .route(routes.login)
  .get(isNotLoggedIn, login.get)
  .post(isNotLoggedIn, login.post);

  router.post("/checkEmail", checkEmail);
  router.post("/checkNumber", checkNumber);

router.get(routes.kakao, kakao);
router.get(routes.kakaoCallback, kakaoCallback, snsLoginRedirectHome);

router.get(routes.naver, naver);
router.get(routes.naverCallback, naverCallback, snsLoginRedirectHome);

router.get(routes.logout, isLoggedIn, logout);

router
  .route(routes.signup)
  .get(isNotLoggedIn, signup.get)
  .post(isNotLoggedIn, signup.post);

router.post("/checkCompanyCode", checkCompanyCode);

router.get(routes.complete, isNotLoggedIn, complete);

router
  .route(routes.vertify)
  .get(isNotLoggedIn, vertify.get)
  .post(isNotLoggedIn, vertify.post);

export default router;
