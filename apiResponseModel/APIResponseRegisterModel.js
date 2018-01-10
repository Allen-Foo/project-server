var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIResponseRegisterModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.email = '';
      this.gender = '';
      this.username = '';
      this.phone = '';
      this.address = '';
      this.isTutor = false;
      this.skill = '';
      this.description = '';
      this.awsId = '';
      this.loginType = '';
      this.googleId = '';
      this.facebookId = '';
      this.avatarUrl = '';
    }

}

module.exports = APIResponseRegisterModel;
