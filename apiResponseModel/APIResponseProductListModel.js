var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIResponseProductListModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.productList = [];
      this.isLastProduct = false;
    }
}

module.exports = APIResponseProductListModel;
