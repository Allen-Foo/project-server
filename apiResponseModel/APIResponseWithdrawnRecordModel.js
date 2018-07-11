var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIResponseWithdrawnRecordModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.withdrawnList = [];
      this.isLastRecord = false;
	  this.lastStartKey = null;
    }
}

module.exports = APIResponseWithdrawnRecordModel;
