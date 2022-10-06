import { User } from "../../db/models";
import AccountsService from "../../services/Accounts.service";
import logger from "../../loader/winston";
import bcrypt from "bcrypt";
import createKey from "../../utils/createKey";

const AccountsServiceInstance = new AccountsService(User);

export const users = {
  get: async (req, res, next) => {
    const users = await AccountsServiceInstance.findAll();
    return res.render("admin/user_list", {
      users,
      message: req.flash("message"),
    });
  },
};

export const create = {
  get: (req, res, next) => {
    res.render("admin/user_create");
  },
  post: async (req, res, next) => {
    try {
      const { name, email, number, role, password, nickname } = req.body;

      const existUser = await AccountsServiceInstance.findByEmail(email);
      if (existUser) {
        req.flash("message", "이미 등록된 이메일 입니다.");
        return res.redirect("/adm/users");
      }

      const hash = await bcrypt.hash(password, 12);
      const verifyKey = await createKey();
      const user = await AccountsServiceInstance.create({
        name,
        email,
        number,
        role,
        password: hash,
        nickname,
        verified: true,
        verifyKey,
      });
      logger.info(`${name} 관리자 회원 등록`);
      req.flash("message", `${user.name}님이 회원 등록 되었습니다.`);
      return res.redirect(`/adm/user/${user.id}`);
    } catch (err) {
      next(err);
    }
  },
};
export const remove = {
  post: async (req, res, next) => {
    try {
      const { checkedUser } = req.body;

      // 1개에는 문자열
      if (typeof checkedUser === "string") {
        const result = await AccountsServiceInstance.destroy(checkedUser);

        if (result) {
          logger.info(`[ 아이디: ${checkedUser} ] 회원 삭제`);
          return res.json({
            success: true,
            message: "회원 삭제 완료",
            removedUsers: checkedUser,
          });
        } else {
          logger.error(`[ 아이디: ${checkedUser} ] 회원 실패`);
          return res.json({
            success: false,
            message: "회원 삭제 실패",
          });
        }
      } else {
        // 2개 이상에서는 배열
        let result = true;
        for (const userId of checkedUser) {
          if (!(await AccountsServiceInstance.destroy(userId))) {
            result = false;
          }
        }
        if (result) {
          logger.info(`[ 아이디: ${checkedUser} ] 회원 삭제`);
          return res.json({
            success: true,
            message: "회원 삭제 완료",
            removedUsers: checkedUser,
          });
        } else {
          logger.error(`[ 아이디: ${checkedUser} ] 회원 실패`);
          return res.json({
            success: false,
            message: "회원 삭제 실패",
          });
        }
      }
    } catch (error) {
      return next(error);
    }
  },
};
