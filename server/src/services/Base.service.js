export default class BaseService {
  constructor(Model) {
    this.Model = Model;
  }

  findAll(options = {}) {
    return this.Model.findAll(options);
  }

  getAllCount(option) {
    if (option) {
      return this.Model.count(option);
    }
    return this.Model.count();
  }

  findByPk(id, option = {}) {
    return this.Model.findByPk(id, option);
  }

  create(data) {
    return this.Model.create(data);
  }

  update(id, data) {
    return this.Model.update(data, {
      where: {
        id,
      },
    });
  }

  destroy(id) {
    return this.Model.destroy({
      where: {
        id,
      },
    });
  }
}
