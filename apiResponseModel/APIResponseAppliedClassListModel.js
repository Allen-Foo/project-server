var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIResponseAppliedClassListModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.appliedClassList = [];
    }
}

module.exports = APIResponseAppliedClassListModel;
