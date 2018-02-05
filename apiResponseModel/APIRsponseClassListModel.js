var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIRsponseClassListModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.classList = [];
    }
}

module.exports = APIRsponseClassListModel;
