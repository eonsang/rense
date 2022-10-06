import bcrypt from "bcrypt";
import moment from "moment";

import { User } from "../../db/models";
import AccountsService from "../../services/Accounts.service";
import routes from "../../routers/routes";
import logger from "../../loader/winston";

const AccountsServiceInstance = new AccountsService(User);

export const index = {
  get: async (req, res, next) => {
    try {
      const user = await AccountsServiceInstance.findByPk(req.user.id);
      return res.render("mypage", {
        user,
      });
    } catch (error) {
      return next(error);
    }
  },
  post: async (req, res, next) => {
    try {
      const {
        number,
        password,
        companyName,
        companyCode,
        companyAddrCode,
        companyAddr1,
        companyAddr2,
        companyAddr3,
      } = req.body;
      let updateData = {
        number,
        companyName,
        companyCode,
        companyAddrCode,
        companyAddr1,
        companyAddr2,
        companyAddr3,
      };
      if (password) {
        const hash = await bcrypt.hash(password, 12);
        updateData = { ...updateData, password: hash };
      }
      const result = await AccountsServiceInstance.update(
        req.user.id,
        updateData
      );

      if (result) {
        req.flash("message", "회원정보가 변경되었습니다.");
        return res.redirect(routes.mypage);
      } else {
        req.flash("message", "회원정보변경 실패");
        return res.redirect(routes.mypage);
      }
    } catch (error) {
      return next(error);
    }
  },
};

export const thumbnail = {
  post: async (req, res) => {
    const result = await AccountsServiceInstance.update(req.user.id, {
      thumbnail: `/${req.file.path}`,
    });

    if (result) {
      logger.info(`${req.user.id}번 회원 썸네일 변경`);
      return res.json({
        success: true,
        imgPath: req.file.path,
      });
    } else {
      return res.json({
        success: false,
        message: "이미지 업로드 실패",
      });
    }
  },
};

export const getAddr = async (req, res, next) => {
  try {
    const user = await AccountsServiceInstance.findByPk(req.user.id);
    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    return next(error);
  }
};
