var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIResponseRefundReportModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.refundList = [];
    }
}

module.exports = APIResponseRefundReportModel;
