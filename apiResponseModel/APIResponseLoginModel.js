var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIResponseLoginModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.email = '';
      this.username = '';
      this.name = '';
      this.website = '';
      this.phone = '';
      this.address = '';
      this.isTutor = false;
      this.skill = '';
      this.introduction = '';
      this.awsId = '';
      this.loginType = '';
      this.googleId = '';
      this.facebookId = '';
      this.avatarUrl = '';
    }

}

module.exports = APIResponseLoginModel;
