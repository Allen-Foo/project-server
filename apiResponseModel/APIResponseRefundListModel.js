var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIResponseRefundListModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.refundList = [];
    }
}

module.exports = APIResponseRefundListModel;
