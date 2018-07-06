var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIResponsePaypalReportModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.paypalList = [];
    }
}

module.exports = APIResponsePaypalReportModel;
