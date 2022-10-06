import BaseService from "./Base.service";

export default class PopupService extends BaseService {
  constructor(Model, ImageModel) {
    super(Model);
    this.ImageModel = ImageModel;
  }

  // overide
  findByPk(id) {
    return this.Model.findByPk(id, {
      include: [
        {
          model: this.ImageModel,
        },
      ],
    });
  }

  ImageCreate(data) {
    return this.ImageModel.create(data);
  }

  imageUpdate(id, data) {
    return this.ImageModel.update(data, {
      where: {
        id,
      },
    });
  }
}
