var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIResponseCoinHistoryListModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.coinHistoryList = [];
      this.isLastRecord = false;
    }
}

module.exports = APIResponseCoinHistoryListModel;
