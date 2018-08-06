var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIResponseTutorModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.profile = {};

      this.selfIntro = '';
      this.profession = '';
      this.experience = 0;
      this.achievementList = '';

    }
}

module.exports = APIResponseTutorModel;
