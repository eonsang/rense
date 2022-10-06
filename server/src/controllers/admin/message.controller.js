import logger from "../../loader/winston";

export const index = {
  get: async (req, res, next) => {
    try {
      return res.render("admin/message");
    } catch (error) {
      console.error(error);
      logger.error("메세지 화면 불러오기 실패");
      return next(error);
    }
  },
  post: (req, res, next) => {},
};
