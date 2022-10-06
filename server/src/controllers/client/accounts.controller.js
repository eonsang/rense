import bcrypt from "bcrypt";
import passport from "passport";
import moment from "moment";

import { User } from "../../db/models";
import AccountsService from "../../services/Accounts.service";
import routes from "../../routers/routes";
import createKey from "../../utils/createKey";
import smtpTransport from "../../utils/mailer";
import logger from "../../loader/winston";
import { sendTalk } from "../../utils/kakaoMessage";

const AccountsServiceInstance = new AccountsService(User);

require("dotenv").config();

export const login = {
  get: (req, res, next) => {
    return res.render("login", {
      message: req.flash("message"),
    });
  },
  post: async (req, res, next) => {
    passport.authenticate("local", (authError, user, info) => {
      if (authError) {
        logger.error("local login authError");
        return next(authError);
      }
      if (!user) {
        req.flash("message", info.message);
        return res.redirect("/accounts/login");
      }
      // if (!user.verified) {
      //   // 인증이 안된 회원
      //   return res.json({
      //     success: true,
      //     verified: false,
      //   });
      // }

      return req.login(user, async (loginError) => {
        if (loginError) {
          return next(loginError);
        }
        logger.info(`${user.name} 로그인`);
        await AccountsServiceInstance.update(user.id, { last_login: moment() });
        return res.json({
          success: true,
          verified: true,
          message: "로그인 완료",
          name: user.name,
        });
      });
    })(req, res, next);
  },
  
};

export const logout = (req, res, next) => {
  req.logout();
  req.session.destroy();
  return res.clearCookie("saveEmail", {
    path: '/accounts'
  }).clearCookie("savePassword", {
    path: '/accounts'
  }).redirect("/");
};

export const signup = {
  get: (req, res, next) => {
    return res.render("signup", {
      message: req.flash("message"),
    });
  },
  post: async (req, res, next) => {
    try {
      const {
        name,
        email,
        number,
        password,
        companyName,
        companyCode,
        companyAddrCode,
        companyAddr1,
        companyAddr2,
        companyAddr3,
      } = req.body;

      const existUser = await AccountsServiceInstance.findByNumber(number);
      if (existUser) {
        req.flash("message", "이미 가입된 연락처 입니다.");
        return res.json({
          success: false,
          message: "이미 가입된 연락처입니다.\n로그인 해주세요.",
        });
      }

      const hash = await bcrypt.hash(password, 12);
      
      const user = await AccountsServiceInstance.create({
        name,
        email,
        number,
        password: hash,
        verified: false,
        companyName,
        companyCode,
        companyAddrCode,
        companyAddr1,
        companyAddr2,
        companyAddr3,
      });
      logger.info(`${name} local 회원가입`);

      req.flash("username", user.name);

      // await sendTalk(
      //   "KA01TP201014061601411g9ppJMlgxmr", // 템플릿 아이디
      //   `${user.name}님이 백산몰에 가입했습니다.`, // 내용
      //   `${process.env.TALK_FORM_NUMBER}` // 관리자에게
      // );
      //
      // await sendTalk(
      //   "KA01TP200928231328447p2BaiyFDnmO", // 템플릿 아이디
      //   `${user.name} 고객님 안녕하세요. 백산안경에 정상적으로 가입이 완료 되었습니다.`, // 내용
      //   `${user.number}` // 상대 연락처
      // );

      return res.json({
        success: true,
        message: "회원가입 성공",
      });
    } catch (err) {
      console.error(err);
      return next(err);
    }
  },
};

// 이메일 확인
export const checkEmail = async (req, res, next) => {
  const { email } = req.body;
  const existUser = await AccountsServiceInstance.findByEmail(email);
  if (existUser) {
    return res.json({
      success: false,
    });
  }
  return res.json({
    success: true,
  });
};

export const checkNumber = async (req, res, next) => {
  const { number } = req.body;
  const existUser = await AccountsServiceInstance.findByNumber(number);
  if (existUser) {
    return res.json({
      success: false,
    });
  }
  return res.json({
    success: true,
  });
};

export const complete = (req, res, next) => {
  return res.render("signupComplete", {
    username: req.flash("username"),
  });
};

export const vertify = {
  get: (req, res, next) => {
    return res.render("vertify", {
      key: req.query.key,
      userId: req.query.id,
    });
  },
  post: async (req, res, next) => {
    try {
      const { key, userId } = req.body;
      const user = await AccountsServiceInstance.findByPk(userId);
      if (!user) {
        req.flash("message", "잘못된 접근입니다.");
        logger.warn(`없는 아이디로 이메일 인증 신청`);
        return res.redirect("/");
      }
      if (user.verified) {
        req.flash("message", "이미 인증된 회원입니다.");
        logger.warn(`[ id: ${user.id} ] 이메일 중복 인증`);
        return res.redirect("/");
      }

      if (user.verifyKey === key) {
        const result = await AccountsServiceInstance.update(userId, {
          verified: true,
        });
        if (result) {
          req.flash("message", "인증이 완료되었습니다.");
          logger.info(`[ id: ${user.id} ] 인증 완료`);
          return res.redirect("/");
        } else {
          logger.warn(`[ id: ${user.id} ] 키는 같으나 인증 업데이트 실패`);
          return res.redirect("/login");
        }
      } else {
        req.flash("message", "인증을 재시도 해주세요.");
        logger.warn(`[ id: ${user.id} ] 유저 키와 인증 키가 다름`);
        return res.redirect("/");
      }
    } catch (error) {
      return next(error);
    }
  },
};

export const kakao = (req, res, next) => {
  passport.authenticate("kakao")(req, res, next);
};

export const kakaoCallback = (req, res, next) => {
  passport.authenticate("kakao", {
    failureRedirect: routes.index,
  })(req, res, next);
};

export const naver = (req, res, next) => {
  passport.authenticate("naver")(req, res, next);
};

export const naverCallback = (req, res, next) => {
  passport.authenticate("naver", {
    failureRedirect: routes.index,
  })(req, res, next);
};

export const snsLoginRedirectHome = async (req, res, next) => {
  logger.info(`${req.user.name} ${req.user.provider} 로그인`);
  await AccountsServiceInstance.update(req.user.id, { last_login: moment() });
  return res.redirect("/");
};

export const checkCompanyCode = async (req, res, next) => {
  try {
    const { code } = req.body;
    const result = await AccountsServiceInstance.findByCompanyCode(code);
    if (!result) {
      return res.json({
        success: true,
        message: "중복된 코드가 없습니다.",
      });
    } else {
      return res.json({
        success: false,
        message: "중복된 코드가 있습니다.",
      });
    }
  } catch (error) {
    return next(error);
  }
};
