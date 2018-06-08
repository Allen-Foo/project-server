var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIResponseProductListModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.productList = [];
    }
}

module.exports = APIResponseProductListModel;
