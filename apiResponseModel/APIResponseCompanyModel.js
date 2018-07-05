var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIResponseCompanyModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.profile = {};

      this.displayName = '';
      this.introduction = '';
      this.logo = '';
      this.slogan = '';
      this.banner = [];

    }
}

module.exports = APIResponseCompanyModel;
