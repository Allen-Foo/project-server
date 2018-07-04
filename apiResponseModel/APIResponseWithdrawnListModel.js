var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIResponseWithdrawnListModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.withdrawnList = [];
    }
}

module.exports = APIResponseWithdrawnListModel;
