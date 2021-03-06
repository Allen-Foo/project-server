var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIResponseUserModel extends APIResponseBaseModel {
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
      this.bookmark = [];
      this.totalRatings = 0;
      this.userRole = '';
      this.gold = 0;
      this.freeGold = 0;
      this.companyId = '';
    }
}

module.exports = APIResponseUserModel;
