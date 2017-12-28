var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIResponseLoginModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.email = '';
      this.gender = '';
      this.fullName = '';
      this.phone = '';
      this.address = '';
      this.isTutor = false;
      this.skill = '';
      this.description = '';
    }

}

module.exports = APIResponseLoginModel;
