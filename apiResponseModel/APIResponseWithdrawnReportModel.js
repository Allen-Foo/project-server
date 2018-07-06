var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIResponseWithdrawnReportModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.withdrawnList = [];
    }
}

module.exports = APIResponseWithdrawnReportModel;
