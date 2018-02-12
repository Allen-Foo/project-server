var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIResponseClassListModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.classList = [];
    }
}

module.exports = APIResponseClassListModel;
