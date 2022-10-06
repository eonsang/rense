import { Board } from "../../db/models";
import BoardService from "../../services/Board.service";
import logger from "../../loader/winston";

const BoardInstance = new BoardService(Board);

export const index = async (req, res, next) => {
  try {
    const { name } = req.params;
    const objects = await BoardInstance.findAll({
      where: {
        name,
      },
    });
    return res.render("admin/board_list", {
      boardName: name,
      objects,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const detail = async (req, res, next) => {
  try {
    const { name, id } = req.params;
    const object = await BoardInstance.findByPk(id);
    return res.render("admin/board_detail", {
      boardName: name,
      object,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { subject, content } = req.body;
    await BoardInstance.update(id, {
      subject,
      content,
    });
    return res.json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await BoardInstance.destroy(id);
    return res.json({
      success: true,
    });
  } catch (error) {
    logger.error("게시물 삭제 실패");
    return next(error);
  }
};

export const removeChecked = {
  post: async (req, res, next) => {
    try {
      const { checkedProduct } = req.body;

      // 1개에는 문자열
      if (typeof checkedProduct === "string") {
        const result = await BoardInstance.destroy(checkedProduct);

        if (result) {
          logger.info(`[ 아이디: ${checkedProduct} ] 게시물 삭제`);
          return res.json({
            success: true,
            message: "게시물 삭제 완료",
            removedUsers: checkedProduct,
          });
        } else {
          logger.error(`[ 아이디: ${checkedProduct} ] 게시물 실패`);
          return res.json({
            success: false,
            message: "게시물 삭제 실패",
          });
        }
      } else {
        // 2개 이상에서는 배열
        let result = true;
        for (const userId of checkedProduct) {
          if (!(await BoardInstance.destroy(userId))) {
            result = false;
          }
        }
        if (result) {
          logger.info(`[ 아이디: ${checkedProduct} ] 게시물 삭제`);
          return res.json({
            success: true,
            message: "게시물 삭제 완료",
            removedUsers: checkedProduct,
          });
        } else {
          logger.error(`[ 아이디: ${checkedProduct} ] 게시물 실패`);
          return res.json({
            success: false,
            message: "게시물 삭제 실패",
          });
        }
      }
    } catch (error) {
      return next(error);
    }
  },
};

export const create = {
  get: async (req, res, next) => {
    try {
      const { name } = req.params;
      return res.render("admin/board_detail", {
        boardName: name,
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  },
  post: async (req, res, next) => {
    try {
      const { name } = req.params;
      const { subject, content } = req.body;
      const object = await BoardInstance.create({
        subject,
        content,
        name,
        UserId: req.user.id,
      });
      return res.json({
        success: true,
        data: object,
      });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  },
};
