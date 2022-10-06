const ADMIN = "/adm";
const SETTING = "/setting";
const POPUP = "/popup";
const CREATE = "/create";
const REMOVE = "/remove";

const routes = {
  // client
  index: "/",

  // accounts
  accounts: "/accounts",
  login: "/login",
  kakao: "/kakao",
  kakaoCallback: "/kakao/callback",
  naver: "/naver",
  naverCallback: "/naver/callback",
  logout: "/logout",
  signup: "/signup",
  complete: "/complete",
  vertify: "/vertify",

  // mypage
  mypage: "/mypage",

  // admin
  admin: "/adm",

  // use Views
  adminSetting: `${ADMIN}${SETTING}`,
  adminPopup: `${ADMIN}${POPUP}`,
  adminPopupCreate: `${ADMIN}${POPUP}${CREATE}`,
  adminPopupRemove: `${ADMIN}${POPUP}${REMOVE}`,
};
export default routes;
