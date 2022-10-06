import {
  Cart,
  Order,
  Payment,
  Product,
  ProductOption,
  ProductOptionDetail,
} from "../../db/models";
import OrderService from "../../services/Order.service";
import CartService from "../../services/Cart.service";
import ProductService from "../../services/Product.service";

import routes from "../../routers/routes";
import logger from "../../loader/winston";
import { sendTalk } from "../../utils/kakaoMessage";

const CartInstance = new CartService(Cart);
const OrderInstance = new OrderService(Order);
const ProductInstance = new ProductService(Product);

require("dotenv").config();

export const order = {
  get: async (req, res, next) => {
    const objects = await OrderInstance.findAll({
      where: {
        UserId: req.user.id,
      },
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

    return res.render("order", {
      objects,
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
        PaymentId: dto.PaymentId,
        total_price: dto.total_price,
        paid_price: dto.paid_price,
        balance_price: dto.balance_price,
      });

      checkedItems.map(async (data) => {
        const cartbox = await CartInstance.findByPk(data, {
          include: [
            {
              model: Product,
            },
          ],
        });

        await ProductInstance.update(cartbox.Product.id, {
          sold_count:
            parseInt(cartbox.Product.sold_count, 10) +
            parseInt(cartbox.quantity, 10),
        });

        await CartInstance.update(data, {
          OrderId: object.id,
        });
      });

      const product = await CartInstance.findByPk(checkedItems[0], {
        include: [
          {
            model: Product,
          },
        ],
      });

      // 예약 시 관리자에게
      await sendTalk(
        "KA01TP210511070839990cWSy13Hm91f", // 템플릿 아이디
        `${req.user.name} 고객님이 ${product.Product.name} 등 ${checkedItems.length} 건을 주문했습니다.`, // 내용
        `${process.env.TALK_FORM_NUMBER}`, // 상대 연락처
        [
          // 버튼
          {
            buttonName: "관리페이지 바로가기",
            buttonType: "WL",
            linkMo: "http://smarteyemall.com/adm",
            linkPc: "http://smarteyemall.com/adm",
          },
        ]
      );

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

export const detail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const object = await OrderInstance.findByPk(id, {
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
            {
              model: ProductOption,
            },
            {
              model: ProductOptionDetail,
            },
          ],
        },
      ],
    });

    object.Carts = await Promise.all(
      object.Carts.map(async (object) => {
        const obj = JSON.parse(object.order_obj);

        object.options = [];
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

          object.options.push({
            option: opt,
            selectedOption: selectedOption,
          });
        }

        return object;
      })
    );

    let vbankDate = null;
    if (object.Payment) {
      vbankDate = new Date(object.Payment.vbank_date * 1000);
    }

    return res.render("order-detail.njk", {
      object,
      vbankDate,
    });
  } catch (error) {
    console.error(error);
    logger.error("주문 조회 실패");
    return next(error);
  }
};

export const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    await OrderInstance.update(id, {
      is_cancel: true,
    });

    return res.redirect(`/order/detail/${id}`);
  } catch (error) {
    console.error(error);
    logger.error("주문 조회 실패");
    return next(error);
  }
};
