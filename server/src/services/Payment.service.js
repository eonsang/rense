import BaseService from "./Base.service";

export default class PaymentService extends BaseService {
  findByMerchantId(merchantId) {
    return this.Model.findOne({
      where: {
        merchant_uid: merchantId,
      },
    });
  }
}
