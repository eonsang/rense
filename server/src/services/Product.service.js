import BaseService from "./Base.service";

export default class CategoryService extends BaseService {
  constructor(Model, OptionModel, OptionDetailModel, ImageModel, DiaModel) {
    super(Model);
    this.OptionModel = OptionModel;
    this.OptionDetailModel = OptionDetailModel;
    this.ImageModel = ImageModel;
    this.DiaModel = DiaModel;
  }

  createProduct(data) {
    return this.Model.create(data);
  }

  createProductImage(data) {
    return this.ImageModel.create(data);
  }

  createProductOption(data) {
    return this.OptionModel.create(data);
  }

  createProductOptionDetail(data) {
    return this.OptionDetailModel.create(data);
  }

  updateProduct(id, data) {
    return this.Model.update(data, {
      where: {
        id,
      },
    });
  }

  updateProductImage(id, data) {
    return this.ImageModel.update(data, {
      where: {
        id,
      },
    });
  }

  updateProductOption(id, data) {
    return this.OptionModel.update(data, {
      where: {
        id,
      },
    });
  }

  updateProductOptionDetail(id, data) {
    return this.OptionDetailModel.update(data, {
      where: {
        id,
      },
    });
  }

  destroyImage(id) {
    return this.ImageModel.destroy({
      where: {
        id,
      },
    });
  }

  destroyOption(id) {
    return this.OptionModel.destroy({
      where: {
        id,
      },
    });
  }

  destroyOptionDetail(id) {
    return this.OptionDetailModel.destroy({
      where: {
        id,
      },
    });
  }

  createDiaOptions(data) {
    return this.DiaModel.create(data);
  }

  updateOptionDia(id, data) {
    return this.DiaModel.update(data, {
      where: {
        id,
      },
    });
  }

  destroyOptionDia(id) {
    return this.DiaModel.destroy({
      where: {
        id,
      },
    });
  }
}
