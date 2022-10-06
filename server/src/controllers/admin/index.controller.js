import {
  Cart,
  Order,
  Product,
  ProductImage,
  ProductOption,
  ProductOptionDetail,
  Qna,
  User,
} from "../../db/models";
import AccountsService from "../../services/Accounts.service";
import routes from "../../routers/routes";
import OrderService from "../../services/Order.service";
import ProductService from "../../services/Product.service";
import QnaService from "../../services/Qna.service";

const AccountsInstance = new AccountsService(User);
const OrderInstance = new OrderService(Order);
const ProductInstance = new ProductService(
  Product,
  ProductOption,
  ProductOptionDetail,
  ProductImage
);
const QnaServiceInstance = new QnaService(Qna);

export const dashboard = async (req, res) => {
  const userCount = await AccountsInstance.getAllCount();
  const users = await AccountsInstance.findAll();
  const productCount = await ProductInstance.getAllCount();
  const qnaCount = await QnaServiceInstance.getAllCount();
  const orders = await OrderInstance.findAll({
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
  });

  // 30일 지나면 태그들이 없어짐
  const products = await ProductInstance.findAll();
  await products.map(async product => {
    const lastUpdated = new Date(product.updatedAt).setDate(new Date(product.updatedAt).getDate() + 30);
    const today = new Date().getTime();

    console.log(lastUpdated < today);
    if( lastUpdated < today ) {
      await ProductInstance.updateProduct(product.id, {
        is_new_item: false,
        is_new_color: false,
        is_best: false,
      });
    }
  });

  const chartData = {};
  const theMonths = new Array(
    "12",
    "11",
    "10",
    "9",
    "8",
    "7",
    "6",
    "5",
    "4",
    "3",
    "2",
    "1"
  );
  const now = new Date();

  const dataLabels = {
    userCount: [],
    orderCount: [],
  };
  for (let i = 0; i < 12; i++) {
    const future = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = theMonths[future.getMonth()];
    const year = future.getFullYear();

    let count = 0;
    users.map((user) => {
      const userCreateDate = new Date(user.createdAt);
      if (
        userCreateDate.getFullYear() === year &&
        userCreateDate.getMonth() + 1 === parseInt(month, 10)
      ) {
        count += 1;
      }
    });

    let orderCount = 0;
    orders.map((order) => {
      const orderCreateDate = new Date(order.createdAt);
      if (
        orderCreateDate.getFullYear() === year &&
        orderCreateDate.getMonth() + 1 === parseInt(month, 10)
      ) {
        orderCount += 1;
      }
    });

    dataLabels.userCount.push(count);
    dataLabels.orderCount.push(orderCount);
  }

  // console.log(dataLabels);

  res.render("admin/index", {
    userCount,
    orders,
    productCount,
    qnaCount,
    users,
    dataLabels,
  });
};
