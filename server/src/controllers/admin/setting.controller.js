import { Setting } from "../../db/models";
import SettingsService from "../../services/Settings.service";
import routes from "../../routers/routes";
import logger from "../../loader/winston";

const SettingsInstance = new SettingsService(Setting);

export const setting = {
  get: async (req, res) => {
    const setting = await SettingsInstance.findByPk(1);
    console.log(setting);
    res.render("admin/setting", {
      setting,
    });
  },
  post: async (req, res, next) => {
    try {
      let dto = {
        ...req.body,
      };
      delete dto.og_image;
      delete dto.favicon;
      if (req.files.og_image) {
        dto = {
          ...dto,
          og_image: `/${req.files.og_image[0].path}`,
        };
      }
      if (req.files.favicon) {
        dto = {
          ...dto,
          favicon: `/${req.files.favicon[0].path}`,
        };
      }

      const result = await SettingsInstance.update(1, dto);
      if (result) {
        logger.info("홈페이지 수정 성공");
        return res.json({
          success: true,
          message: "홈페이지 수정 성공",
        });
      } else {
        logger.error("홈페이지 수정 실패");
        return res.json({
          success: false,
          message: "홈페이지 수정 실패",
        });
      }
    } catch (error) {
      return next(error);
    }
  },
};
