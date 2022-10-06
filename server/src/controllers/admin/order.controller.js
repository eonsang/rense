import {
  User,
  Cart,
  Order,
  Payment,
  Product,
  ProductOption,
  ProductOptionDetail,
} from "../../db/models";
import OrderService from "../../services/Order.service";
import CartService from "../../services/Cart.service";
import {Op} from 'sequelize';

import routes from "../../routers/routes";
import logger from "../../loader/winston";
import AccountsService from "../../services/Accounts.service";
import { sendTalk } from "../../utils/kakaoMessage";

const CartInstance = new CartService(Cart);
const OrderInstance = new OrderService(Order);
const AccountsServiceInstance = new AccountsService(User);

export const order = {
  get: async (req, res, next) => {
    const { is_state, manager, keyword } = req.query;

    let where = {};
    if(is_state) {
      where = {
        ...where,
        is_state
      }
    }
    if(manager) {
      where = {
        ...where,
        manager
        }
      }
    if(keyword) {
      where = {
        ...where,
        [Op.or]: [
          {
            name: {
              [Op.like]: `%${keyword}%`
            }
          },
          {
            number: {
              [Op.like]: `%${keyword}%`
            }
          },
        ]
      }
    };
    const objects = await OrderInstance.findAll({
      where,
      include: [
        {
          model: Payment,
        },
        {
          model: Cart,
          include: [
            {
              model: Product,
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const managers = await AccountsServiceInstance.findAll({
      where: {
        role: "manager",
      },
    });

    return res.render("admin/order_list", {
      objects,
      managers,
      query: req.query
    });
  },
  post: async (req, res, next) => {
    try {
      const dto = req.body;
      const checkedItems = JSON.parse(dto.checkedItem);
      const object = await OrderInstance.create({
        name: dto.name,
        number: dto.number,
        zipcode: dto.zipcode,
        addr1: dto.addr1,
        addr2: dto.addr2,
        addr3: dto.addr3,
        UserId: req.user.id,
      });

      checkedItems.map(async (data) => {
        await CartInstance.update(data, {
          OrderId: object.id,
        });
      });

      return res.json({
        success: true,
        result: object,
      });
    } catch (error) {
      console.error(error);
      logger.error("주문 등록 실패");
      return next(error);
    }
  },
};

export const orderSendTrue = async (req, res, next) => {
  try {
    const { id } = req.params;

    await OrderInstance.update(id, {
      is_send: true,
    });

    // 카카오 메세지 보내기

    return res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
export const orderSendFalse = async (req, res, next) => {
  try {
    const { id } = req.params;

    await OrderInstance.update(id, {
      is_send: false,
    });
    return res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const orderPaidTrue = async (req, res, next) => {
  try {
    const { id } = req.params;

    await OrderInstance.update(id, {
      is_paid: true,
    });

    // 카카오 메세지 보내기

    return res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
export const orderPaidFalse = async (req, res, next) => {
  try {
    const { id } = req.params;

    await OrderInstance.update(id, {
      is_paid: false,
    });
    return res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
export const chageOrderManager = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { managerId } = req.body;

    await OrderInstance.update(id, {
      manager: managerId,
    });
    return res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const detail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const object = await OrderInstance.findByPk(id, {
      include: [
        {
          model: User,
        },
        {
          model: Payment,
        },
        {
          model: Cart,
          include: [
            {
              model: Product,
            },
          ],
        },
      ],
    });

    object.Carts = await Promise.all(
      object.Carts.map(async (ob) => {
        const obj = JSON.parse(ob.order_obj);

        ob.options = [];
        for (const key in obj) {
          const opt = await ProductOption.findOne({
            where: {
              id: key,
            },
          });
          const optValue = await ProductOptionDetail.findAll({
            where: {
              ProductOptionId: opt.id,
            },
          });

          const selectedOption = optValue.find(
            (el) => el.id === parseInt(obj[key], 10)
          );

          ob.options.push({
            option: opt,
            selectedOption: selectedOption,
          });
        }

        return ob;
      })
    );

    console.log(object.User);

    return res.render("admin/order_detail", {
      object,
    });
  } catch (error) {
    console.error(error);
    logger.error("주문 조회 실패");
    return next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    await OrderInstance.update(id, {
      memo: req.body.memo,
    });

    return res.redirect("/adm/order/detail/" + id);
  } catch (error) {
    console.error(error);
    logger.error("주문 조회 실패");
    return next(error);
  }
};

export const stateChange = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { value } = req.body;
    await OrderInstance.update(id, {
      is_state: value,
    });
    const result = await OrderInstance.findByPk(id, {
      include: [
        {
          model: Cart,
          include: [
            {
              model: Product,
            },
          ],
        },
      ],
    });
    const user = await AccountsServiceInstance.findByPk(result.UserId);

    // 재고소진시 회원에게
    if (value === "exhausted") {
      await sendTalk(
        "KA01TP210511071412764J6uVY8pwIJm", // 템플릿 아이디
        `${result.name} 고객님께서 예약해주신 ${result.Carts[0].Product.name} 등 ${result.Carts.length}건이 현재 매장 재고 소진으로 인하여 본사 주문 후, 해당 상품이 준비되면 도착문자 드리겠습니다.

감사합니다. :)`, // 내용
        `${result.number}`, // 상대 연락처
        [
          // 버튼
          {
            buttonName: "홈페이지 바로가기",
            buttonType: "WL",
            linkMo: "http://smarteyemall.com",
            linkPc: "http://smarteyemall.com",
          },
        ]
      );
    }


    // 검수완료시 회원에게
    if (value === "ready") {
      await sendTalk(
        "KA01TP210524072330486faz6iiKZgqg", // 템플릿 아이디
        `안녕하세요. 한빛방화안경랜드입니다.
${result.name} 고객님께서 예약해주신 ${result.Carts[0].Product.name}의 준비가 완료되었습니다.

매장 내 방문 후 수령하시길 바랍니다. 감사합니다 :)`, // 내용
        `${result.number}`, // 상대 연락처
        [
          // 버튼
          {
            buttonName: "홈페이지 바로가기",
            buttonType: "WL",
            linkMo: "http://smarteyemall.com/",
            linkPc: "http://smarteyemall.com/",
          },
        ]
      );
    }
    return res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    logger.error("주문 조회 실패");
    return next(error);
  }
};
