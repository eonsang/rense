import {
  Product,
  ProductOption,
  ProductOptionDetail,
  ProductImage,
  Category,
  LensDiaOption,
  SampleOption,
} from "../../db/models";
import ProductService from "../../services/Product.service";
import CategoryService from "../../services/Category.service";
import BaseService from "../../services/Base.service";

import logger from "../../loader/winston";

const ProductInstance = new ProductService(
  Product,
  ProductOption,
  ProductOptionDetail,
  ProductImage,
  LensDiaOption
);

const CategoryInstance = new CategoryService(Category);
const SampleOptionInstance = new BaseService(SampleOption);

export const index = async (req, res, next) => {
  try {
    const products = await ProductInstance.findAll({
      include: [
        {
          model: ProductImage,
        },
        {
          model: Category,
        },
      ],
    });

    return res.render("admin/product_list", {
      products,
    });
  } catch (error) {
    logger.error("상품 fetch 에러");
    return next(error);
  }
};

export const create = {
  post: async (req, res, next) => {
    try {
      console.log(req.body);

      const productDto = req.body;
      const files = req.files;
      let data = {
        name: productDto.name,
        maker: productDto.maker,
        origin: productDto.origin,
        brand: productDto.brand,
        entertainer: productDto.entertainer,
        model: productDto.model,
        description: productDto.description,
        memo: productDto.memo,
        order: productDto.order,
        hit: 0,
        content: productDto.content,
        price: productDto.price,
        customer_price: productDto.customer_price,
      };

      if (productDto.sold_out) {
        data = {
          ...data,
          sold_out: productDto.sold_out === "on",
        };
      }
      if (productDto.use) {
        data = {
          ...data,
          use: productDto.use === "on",
        };
      }
      if (productDto.is_lens) {
        data = {
          ...data,
          is_lens: productDto.is_lens === "on",
        };
      }

      if (productDto.is_new_item) {
        data = {
          ...data,
          is_new_item: productDto.is_new_item === "on",
        };
      }

      if (productDto.is_new_color) {
        data = {
          ...data,
          is_new_color: productDto.is_new_color === "on",
        };
      }

      if (productDto.is_best) {
        data = {
          ...data,
          is_best: productDto.is_best === "on",
        };
      }

      if (productDto.is_payment) {
        data = {
          ...data,
          is_payment: productDto.is_payment === "on",
        };
      }

      const product = await ProductInstance.createProduct(data);
      const category1 = await CategoryInstance.findByPk(productDto.category1);
      await product.addCategory(category1);
      if (productDto.category2) {
        const category2 = await CategoryInstance.findByPk(productDto.category2);
        await product.addCategory(category2);
      }
      if (productDto.category3) {
        const category3 = await CategoryInstance.findByPk(productDto.category3);
        await product.addCategory(category3);
      }

      files.map(async (file) => {
        await ProductInstance.createProductImage({
          path: file.path,
          name: file.filename,
          type: file.mimetype,
          size: file.size,
          original_name: file.originalname,
          ProductId: product.id,
        });
      });

      if (req.body.optionInfo) {
        JSON.parse(req.body.optionInfo).map(async (option) => {
          const object = await ProductInstance.createProductOption({
            name: option.name,
            ProductId: product.id,
          });
          option.list.map(async (obj) => {
            const optionDetail = await ProductInstance.createProductOptionDetail(
              {
                name: obj.name,
                path: obj.path,
                price: obj.price,
                sold_out: obj.sold_out === "on",
                order: parseInt(obj.order, 10),
                ProductOptionId: object.id,
              }
            );
            if (req.body.diaOptionInfo) {
              JSON.parse(req.body.diaOptionInfo).map(async (option) => {
                await ProductInstance.createDiaOptions({
                  name: option.name,
                  ProductOptionDetailId: optionDetail.id,
                });
              });
            }
          });
        });
      }

      return res.json({
        success: true,
        id: product.id,
      });
    } catch (error) {
      console.log(error);
      logger.error("상품 등록 에러");
      return next(error);
    }
  },
  get: async (req, res) => {
    const categories = await CategoryInstance.findAll({
      order: [["order", "DESC"]],
      where: {
        CategoryId: null,
      },
    });
    const options = await SampleOptionInstance.findAll();
    return res.render("admin/product_detail", {
      categories,
      options,
    });
  },
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productDto = req.body;
    const files = req.files;

    let data = {
      name: productDto.name,
      maker: productDto.maker,
      origin: productDto.origin,
      brand: productDto.brand,
      entertainer: productDto.entertainer,
      model: productDto.model,
      description: productDto.description,
      memo: productDto.memo,
      content: productDto.content,
      price: productDto.price,
      order: productDto.order,
      customer_price: productDto.customer_price,
    };

    if (productDto.category2) {
      data = {
        ...data,
        category2: productDto.category2,
      };
      if (productDto.category3) {
        data = {
          ...data,
          category3: productDto.category3,
        };
      }
    }
    if (productDto.sold_out) {
      data = {
        ...data,
        sold_out: productDto.sold_out === "on",
      };
    }
    if (productDto.use) {
      data = {
        ...data,
        use: productDto.use === "on",
      };
    }

    if (productDto.is_lens) {
      data = {
        ...data,
        is_lens: productDto.is_lens === "on",
      };
    }

    if (productDto.is_new_item) {
      data = {
        ...data,
        is_new_item: productDto.is_new_item === "on",
      };
    }

    if (productDto.is_new_color) {
      data = {
        ...data,
        is_new_color: productDto.is_new_color === "on",
      };
    }

    if (productDto.is_best) {
      data = {
        ...data,
        is_best: productDto.is_best === "on",
      };
    }

    if (productDto.is_payment) {
      data = {
        ...data,
        is_payment: productDto.is_payment === "on",
      };
    }

    await ProductInstance.updateProduct(id, data);
    const category1 = await CategoryInstance.findByPk(productDto.category1);
    const product = await ProductInstance.findByPk(id, {
      include: [
        {
          model: Category,
        },
      ],
    });

    await product.setCategories([category1]);
    if (productDto.category2) {
      const category2 = await CategoryInstance.findByPk(productDto.category2);
      await product.setCategories([category1, category2]);
      if (productDto.category3) {
        const category3 = await CategoryInstance.findByPk(productDto.category3);
        await product.setCategories([category1, category2, category3]);
      }
    }

    if (files) {
      files.map(async (file) => {
        await ProductInstance.createProductImage({
          path: file.path,
          name: file.filename,
          type: file.mimetype,
          size: file.size,
          original_name: file.originalname,
          ProductId: id,
        });
      });
    }

    console.log("optionInfo", JSON.parse(req.body.optionInfo));
    if (req.body.optionInfo) {
      JSON.parse(req.body.optionInfo).map(async (option) => {
        if (!option.id) {
          const object = await ProductInstance.createProductOption({
            name: option.name,
            ProductId: id,
          });
          option.list.map(async (obj) => {
            console.log("obj", obj);
            if (!obj.id) {
              await ProductInstance.createProductOptionDetail({
                name: obj.name,
                path: obj.path,
                price: obj.price,
                sold_out: obj.sold_out === "on",
                order: parseInt(obj.order, 10),
                ProductOptionId: object.id,
              });
            } else {
              await ProductInstance.updateProductOptionDetail(obj.id, {
                name: obj.name,
                path: obj.path,
                price: obj.price,
                sold_out: obj.sold_out === "on",
                order: parseInt(obj.order, 10),
              });
            }
          });
        } else {
          await ProductInstance.updateProductOption(option.id, {
            name: option.name,
          });
          option.list.map(async (obj) => {
            console.log("obj", obj);
            if (!obj.id) {
              await ProductInstance.createProductOptionDetail({
                name: obj.name,
                path: obj.path,
                price: obj.price,
                sold_out: obj.sold_out === "on",
                order: parseInt(obj.order, 10),
                ProductOptionId: option.id,
              });
            } else {
              await ProductInstance.updateProductOptionDetail(obj.id, {
                name: obj.name,
                path: obj.path,
                price: obj.price,
                sold_out: obj.sold_out === "on",
                order: parseInt(obj.order, 10),
              });

              // 수정
              if (req.body.diaOptionInfo) {
                JSON.parse(req.body.diaOptionInfo).map(async (option) => {
                  console.log(option);
                  if (!option.id) {
                    await ProductInstance.createDiaOptions({
                      name: option.name,
                      ProductOptionDetailId: obj.id,
                    });
                  } else {
                    await ProductInstance.updateOptionDia(option.id, {
                      name: option.name,
                    });
                  }
                });
              }
            }
          });
        }
      });
    }

    return res.json({
      success: true,
      id,
    });
  } catch (error) {
    console.error(error);
    logger.error("상품 등록 에러");
    return next(error);
  }
};

export const detail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const options = await SampleOptionInstance.findAll();
    const product = await ProductInstance.findByPk(id, {
      order: [
        [Category, "id", "ASC"],
        [ProductImage, "createdAt", "ASC"],
        [ProductOption, { model: ProductOptionDetail }, "order", "ASC"],
      ],
      include: [
        {
          model: Category,
        },
        {
          model: ProductOption,
          include: [
            {
              model: ProductOptionDetail,
              include: [
                {
                  model: LensDiaOption,
                },
              ],
            },
          ],
        },
        {
          model: ProductImage,
        },
      ],
    });
    const categories = await CategoryInstance.findAll({
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

    if (!product) {
      return res.redirect("/adm/product");
    }
    return res.render("admin/product_detail", {
      product,
      categories,
      options,
    });
  } catch (error) {
    logger.error("상품 가져오기 에러");
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await ProductInstance.destroy(id);
    logger.error("상품 삭제 완료");
    return res.json({
      success: true,
    });
  } catch (error) {
    logger.error("상품 삭제 에러");
    return next(error);
  }
};

export const removeChecked = {
  post: async (req, res, next) => {
    try {
      const { checkedProduct } = req.body;

      // 1개에는 문자열
      if (typeof checkedProduct === "string") {
        const result = await ProductInstance.destroy(checkedProduct);

        console.log(result);
        if (result) {
          logger.info(`[ 아이디: ${checkedProduct} ] 상품 삭제`);
          return res.json({
            success: true,
            message: "상품 삭제 완료",
            removedUsers: checkedProduct,
          });
        } else {
          logger.error(`[ 아이디: ${checkedProduct} ] 상품 실패`);
          return res.json({
            success: false,
            message: "상품 삭제 실패",
          });
        }
      } else {
        // 2개 이상에서는 배열
        let result = true;
        for (const userId of checkedProduct) {
          if (!(await ProductInstance.destroy(userId))) {
            result = false;
          }
        }
        if (result) {
          logger.info(`[ 아이디: ${checkedProduct} ] 상품 삭제`);
          return res.json({
            success: true,
            message: "상품 삭제 완료",
            removedUsers: checkedProduct,
          });
        } else {
          logger.error(`[ 아이디: ${checkedProduct} ] 상품 실패`);
          return res.json({
            success: false,
            message: "상품 삭제 실패",
          });
        }
      }
    } catch (error) {
      return next(error);
    }
  },
};

export const removeImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    await ProductInstance.destroyImage(id);
    logger.error("이미지 삭제 완료");
    return res.json({
      success: true,
    });
  } catch (error) {
    logger.error("상품 삭제 에러");
    return next(error);
  }
};

export const removeOption = async (req, res, next) => {
  try {
    const { id } = req.params;
    await ProductInstance.destroyOption(id);
    logger.error("옵션 삭제 완료");
    return res.json({
      success: true,
    });
  } catch (error) {
    logger.error("옵션 삭제 에러");
    return next(error);
  }
};

export const removeOptionDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    await ProductInstance.destroyOptionDetail(id);
    logger.error("옵션상세 삭제 완료");
    return res.json({
      success: true,
    });
  } catch (error) {
    logger.error("옵션상세 삭제 에러");
    return next(error);
  }
};

export const removeOptionDia = async (req, res, next) => {
  try {
    const { id } = req.params;
    await ProductInstance.destroyOptionDia(id);
    logger.error("옵션상세 삭제 완료");
    return res.json({
      success: true,
    });
  } catch (error) {
    logger.error("옵션상세 삭제 에러");
    return next(error);
  }
};

export const changeUse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { use } = req.body;
    await ProductInstance.updateProduct(id, {
      use,
    });
    return res.json({
      success: true,
    });
  } catch (error) {
    logger.error("옵션상세 수정 에러");
    return next(error);
  }
};
export const changeSoldout = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { sold_out } = req.body;
    await ProductInstance.updateProduct(id, {
      sold_out,
    });
    return res.json({
      success: true,
    });
  } catch (error) {
    logger.error("옵션상세 수정 에러");
    return next(error);
  }
};
