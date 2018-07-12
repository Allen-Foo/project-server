var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIResponseCreateClassModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.classList = [];
      this.user = {};
    }
}

module.exports = APIResponseCreateClassModel;
