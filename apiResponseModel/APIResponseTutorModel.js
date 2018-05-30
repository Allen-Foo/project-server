var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIResponseTutorModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.email = '';
      this.username = '';
      this.tutorName = '';
      this.website = '';
      this.phone = '';
      this.address = '';
      this.isTutor = false;
      this.skill = '';
      this.introduction = '';
      this.awsId = '';
      this.userId = '';
      this.loginType = '';
      this.googleId = '';
      this.facebookId = '';
      this.avatarUrl = '';
      this.bookmark = [];
      this.totalRatings = 0;
      this.userRole = '';
      this.companyId = '';
    }
}

module.exports = APIResponseTutorModel;
