import { Category, Setting, Cart } from "../db/models";

import routes from "../routers/routes";
import logger from "../loader/winston";

import SettingsService from "../services/Settings.service";
import CategoryService from "../services/Category.service";
import CartService from "../services/Cart.service";

const SettingsInstance = new SettingsService(Setting);
const CategoryInstance = new CategoryService(Category);
const CartInstance = new CartService(Cart);

const localsMiddleware = async (req, res, next) => {
  res.locals.defaultInfo = await SettingsInstance.findByPk(1);
  res.locals.navCategories = await CategoryInstance.findAll({
    order: [["order", "DESC"]],
    where: {
      CategoryId: null,
    },
    include: [
      {
        // 2 depth
        model: Category,
        as: "children",
        include: [
          {
            // 3 depth
            model: Category,
            as: "children",
          },
        ],
      },
    ],
  });
  res.locals.siteName = "오늘기록";
  res.locals.routes = routes;
  if (req.user) {
    res.locals.cartCount = await CartInstance.findAll({
      where: {
        UserId: req.user.id,
        OrderId: null,
      },
    });
  }
  next();
};

export default localsMiddleware;
