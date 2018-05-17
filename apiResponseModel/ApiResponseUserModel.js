var APIResponseBaseModel = require("./APIResponseBaseModel");

class ApiResponseUserModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.email = '';
      this.username = '';
      this.name = '';
      this.website = '';
      this.phone = '';
      this.address = '';
      this.isTutor = false;
      this.isCompany = false;
      this.skill = '';
      this.introduction = '';
      this.awsId = '';
      this.loginType = '';
      this.googleId = '';
      this.facebookId = '';
      this.avatarUrl = '';
      this.bookmark = [];
      this.totalRatings = 0;
      this.userRole = '';
    }
}

module.exports = ApiResponseUserModel;
