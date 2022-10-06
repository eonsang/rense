import { Board, User } from "../../db/models";
import BoardService from "../../services/Board.service";
import logger from "../../loader/winston";

const BoardInstance = new BoardService(Board);

export const index = {
  get: async (req, res, next) => {
    try {
      const { name } = req.params;
      const objects = await BoardInstance.findAll({
        where: {
          name,
        },
        include: [
          {
            model: User,
          },
        ],
      });

      return res.render("board_list", {
        boardName: name,
        objects,
      });
    } catch (error) {
      logger.error("게시판 가져오기 실패");
      return next(error);
    }
  },
};

export const detail = async (req, res, next) => {
  try {
    const { name, id } = req.params;
    const object = await BoardInstance.findByPk(id, {
      include: [{ model: User }],
    });
    return res.render("board_detail", {
      boardName: name,
      object,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
};
