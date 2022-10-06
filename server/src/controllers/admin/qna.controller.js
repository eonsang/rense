import moment from "moment";

import { User, Qna } from "../../db/models";
import QnaService from "../../services/Qna.service";
import routes from "../../routers/routes";
import logger from "../../loader/winston";

const QnaServiceInstance = new QnaService(Qna);

export const index = async (req, res, next) => {
  try {
    const objects = await QnaServiceInstance.findAll({
      include: [User],
    });

    console.log(objects);
    return res.render("admin/faq_list", {
      objects,
    });
  } catch (error) {
    return next(error);
  }
};

export const detail = {
  get: async (req, res, next) => {
    try {
      const { id } = req.params;
      const object = await QnaServiceInstance.findByPk(id, {
        include: [
          {
            model: User,
          },
        ],
      });
      return res.render("admin/faq_detail", {
        object,
      });
    } catch (error) {
      return next(error);
    }
  },
};

export const update = {
  post: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { reply_content } = req.body;

      const result = await QnaServiceInstance.update(id, {
        reply_content,
        reply_datetime: moment(),
        reply_user: req.user.id,
        reply_created_ip: req.ipInfo.ip,
      });
      if (result) {
        return res.json({
          success: true,
          message: "업데이트 성공",
        });
      } else {
        return res.json({
          success: false,
          message: "업데이트 실패",
        });
      }
    } catch (error) {
      return next(error);
    }
  },
};

export const remove = {
  post: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await QnaServiceInstance.destroy(id);
      if (result) {
        return res.json({
          success: true,
          message: "삭제 성공",
        });
      } else {
        logger.error("1:1 문의 삭제 실패");
        return res.json({
          success: false,
          message: "삭제 실패",
        });
      }
    } catch (error) {
      return next(error);
    }
  },
};
