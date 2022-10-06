import { SampleOption } from "../../db/models";
import BaseService from "../../services/Base.service";

const BaseInstance = new BaseService(SampleOption);

export const index = async (req, res, next) => {
  try {
    const objects = await BaseInstance.findAll();

    console.log(objects);

    return res.render("admin/option_list", {
      objects,
    });
  } catch (error) {
    return next(error);
  }
};

export const getCreate = async (req, res, next) => {
  try {
    return res.render("admin/option_detail", {});
  } catch (error) {
    return next(error);
  }
};

export const postCreate = async (req, res, next) => {
  try {
    const requestData = JSON.parse(req.body.data);

    await Promise.all(
      requestData.map(async (data) => {
        await BaseInstance.create({
          name: data.name,
          objects: JSON.stringify(data.list),
          UserId: req.user.id,
        });
      })
    );

    return res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

export const getDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const option = await BaseInstance.findByPk(id);
    console.log(option);
    option.list = JSON.parse(option.objects);

    return res.render("admin/option_detail", {
      option,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
export const postDetail = async (req, res, next) => {
  try {
    const requestData = JSON.parse(req.body.data);
    await BaseInstance.update(requestData[0].id, {
      name: requestData[0].name,
      objects: JSON.stringify(requestData[0].list),
    });

    return res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

export const jsonDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const option = await BaseInstance.findByPk(id);

    return res.json({
      success: true,
      option,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await BaseInstance.destroy(id);

    return res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
