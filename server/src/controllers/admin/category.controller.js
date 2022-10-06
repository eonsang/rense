import { Category } from "../../db/models";
import CategoryService from "../../services/Category.service";
import logger from "../../loader/winston";

const CategoryInstance = new CategoryService(Category);

export const index = async (req, res, next) => {
  try {
    const objects = await CategoryInstance.findAll({
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
    return res.render("admin/category_list", {
      objects,
    });
  } catch (error) {
    logger.error("카테고리 불러오기 실패");
    return next(error);
  }
};

export const child = async (req, res, next) => {
  try {
    const { id } = req.query;
    const objects = await CategoryInstance.findAll({
      where: {
        CategoryId: id,
      },
    });
    return res.json({
      success: true,
      objects,
    });
  } catch (error) {
    logger.error("카테고리 불러오기 실패");
    return next(error);
  }
};

export const detail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const object = await CategoryInstance.findByPk(id);
    const category = await CategoryInstance.findAll({
      where: {
        CategoryId: null,
      },
    });
    console.log(object);
    return res.render("admin/category_detail", {
      object,
      category,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, order, category1 } = req.body;
    let CategoryId = null;
    if (category1) {
      CategoryId = category1;
    }
    await CategoryInstance.update(id, {
      name,
      order: order || 0,
      CategoryId: CategoryId || null,
    });
    return res.redirect(`/adm/category/detail/${id}`);
  } catch (error) {
    logger.error("카테고리 수정 실패");
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await CategoryInstance.destroy(id);
    return res.json({
      success: true,
    });
  } catch (error) {
    logger.error("카테고리 삭제 실패");
    return next(error);
  }
};

export const create = {
  get: async (req, res, next) => {
    try {
      const category = await CategoryInstance.findAll({
        where: {
          CategoryId: null,
        },
      });
      return res.render("admin/category_detail", {
        category,
      });
    } catch (error) {
      logger.error("카테고리 등록 페이지 불러오기 실패");
      return next(error);
    }
  },
  post: async (req, res, next) => {
    try {
      const dto = req.body;
      const { name, order, category1, category2, category3, category4 } = dto;

      console.log(dto);
      let CategoryId = null;
      if (category1) {
        CategoryId = category1;
      }
      if (category2) {
        CategoryId = category2;
      }
      if (category3) {
        CategoryId = category3;
      }
      if (category4) {
        CategoryId = category4;
      }
      const object = await CategoryInstance.create({
        name,
        order: order || 0,
        CategoryId: CategoryId || null,
      });
      return res.redirect(`/adm/category`);
    } catch (error) {
      logger.error("카테고리 등록 실패");
      return next(error);
    }
  },
};
