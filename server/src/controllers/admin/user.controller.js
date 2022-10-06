import {
  User,
  Qna,
  Order,
  Cart,
  Product,
  ProductOption,
  ProductOptionDetail,
} from "../../db/models";
import AccountsService from "../../services/Accounts.service";
import logger from "../../loader/winston";
import bcrypt from "bcrypt";
import createKey from "../../utils/createKey";
import { sendTalk } from "../../utils/kakaoMessage";

const AccountsServiceInstance = new AccountsService(User);

export const detail = {
  get: async (req, res, next) => {
    const { id } = req.params;
    const user = await AccountsServiceInstance.findByPk(id, {
      include: [
        {
          model: Qna,
        },
        {
          model: Order,
          include: [
            {
              model: Cart,
              include: [
                {
                  model: Product,
                },
                {
                  model: ProductOption,
                },
                {
                  model: ProductOptionDetail,
                },
              ],
            },
          ],
        },
      ],
    });

    console.log("user", user);
    return res.render("admin/user_detail", {
      user,
      message: req.flash("message"),
    });
  },
  post: async (req, res, next) => {
    const { id } = req.params;
    const { nickname, role, number, password, verified } = req.body;
    let data = {
      nickname,
      number,
      role,
      verified,
    };
    if (password && password !== "") {
      const hash = await bcrypt.hash(password, 12);
      data = {
        ...data,
        password: hash,
      };
    }

    const user = await AccountsServiceInstance.findByPk(id);
    if (verified) {
      sendTalk(
        "KA01TP201014061652352Od9BhC1QwZs", // 템플릿 아이디
        `${user.name} 님 승인이 완료되어 정상적으로 사이트 이용이 가능하십니다. 감사합니다.`, // 내용
        `${user.number}`, // 상대 연락처
        [
          // 버튼
          {
            buttonName: "홈페이지 바로가기",
            buttonType: "WL",
            linkMo: "http://baeksanmall.com",
            linkPc: "http://baeksanmall.com",
          },
        ]
      );
    }

    const result = await AccountsServiceInstance.update(id, data);
    if (result) {
      req.flash("message", "회원정보가 수정 되었습니다.");
      return res.redirect(`/adm/user/${id}`);
    }
  },
};
