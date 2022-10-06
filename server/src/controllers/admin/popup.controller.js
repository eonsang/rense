import { Popup, PopupImage } from "../../db/models";
import PopupService from "../../services/Popup.service";
import routes from "../../routers/routes";
import logger from "../../loader/winston";

const PopupServiceInstance = new PopupService(Popup, PopupImage);

export const popup = {
  get: async (req, res, next) => {
    const popup = await PopupServiceInstance.findAll();
    res.render("admin/popup_list", {
      objects: popup,
    });
  },
};

export const create = {
  get: (req, res, next) => {
    res.render("admin/popup_detail", {
      type: "create",
    });
  },
  post: async (req, res, next) => {
    try {
      const dto = req.body;
      const fileDto = req.file;

      const popup = await PopupServiceInstance.create({
        is_active: dto.is_active === "on",
        start_date: dto.start_date,
        end_date: dto.end_date,
        title: dto.title,
        width: dto.width,
        link: dto.link,
        target_blank: dto.target_blank === "on",
        position_x: parseInt(dto.position_x, 10),
        position_y: parseInt(dto.position_y, 10),
      });

      const result = await PopupServiceInstance.ImageCreate({
        PopupId: popup.id,
        path: `/${fileDto.path}`,
        original_name: fileDto.originalname,
        size: fileDto.size,
        type: fileDto.mimetype,
        name: fileDto.filename,
      });
      if (result) {
        return res.redirect(`${routes.adminPopup}/detail/${popup.id}`);
      } else {
        return res.redirect(routes.adminPopupCreate);
      }
    } catch (error) {
      next(error);
    }
  },
};

export const remove = {
  post: async (req, res, next) => {
    try {
      const { id } = req.params;
      const result = await PopupServiceInstance.destroy(id);
      if (result) {
        return res.json({
          success: true,
          message: "삭제 성공",
        });
      } else {
        logger.error("팝업 삭제 실패");
        return res.json({
          success: false,
          message: "삭제 실패",
        });
      }
    } catch (error) {
      logger.error("팝업 삭제 실패");
      return next(error);
    }
  },
};

export const detail = {
  get: async (req, res, next) => {
    try {
      const { id } = req.params;
      console.log(id);

      const popup = await PopupServiceInstance.findByPk(id);

      console.log(popup.PopupImages);
      return res.render("admin/popup_detail", {
        object: popup,
        type: "modify",
      });
    } catch (error) {
      logger.error("상세 이미지 불러오기 실패");
      return next(error);
    }
  },
  post: async (req, res, next) => {
    try {
      const dto = req.body;
      const fileDto = req.file;
      const { id } = req.params;

      await PopupServiceInstance.update(id, {
        is_active: dto.is_active === "on",
        start_date: dto.start_date,
        end_date: dto.end_date,
        title: dto.title,
        width: dto.width,
        link: dto.link,
        target_blank: dto.target_blank === "on",
        position_x: parseInt(dto.position_x, 10),
        position_y: parseInt(dto.position_y, 10),
      });

      if (fileDto) {
        await PopupServiceInstance.imageUpdate(dto.imageId, {
          PopupId: id,
          path: `/${fileDto.path}`,
          original_name: fileDto.originalname,
          size: fileDto.size,
          type: fileDto.mimetype,
          name: fileDto.filename,
        });
      }

      return res.redirect(`${routes.adminPopup}/detail/${id}`);
    } catch (error) {
      logger.error("상세 이미지 수정 실패");
      return next(error);
    }
  },
};
