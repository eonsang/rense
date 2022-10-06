import BaseService from "./Base.service";

export default class AccountsService extends BaseService {
  findByEmail(email) {
    return this.Model.findOne({
      where: {
        email,
      },
    });
  }

  findBySnsId(snsId, each) {
    return this.Model.findOne({
      where: {
        snsId,
        ...each,
      },
    });
  }

  findByNumber(number) {
    return this.Model.findOne({
      where: {
        number,
      },
    });
  }

  findByCompanyCode(code) {
    return this.Model.findOne({
      where: {
        companyCode: code,
      },
    });
  }
}
