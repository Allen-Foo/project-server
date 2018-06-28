var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIResponseRevenueModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.revenue = 0;
      this.pendingRevenue = 0;
    }
}

module.exports = APIResponseRevenueModel;
