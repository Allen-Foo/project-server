var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIResponseClassModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.title = '';
      this.category = '';
      this.skill = '';
      this.time = '';
      this.address = '';
      this.phone = '';
      this.description = '';
      this.photoList = '';
      this.fee = 0;
      this.classId = '';
      this.userId = '';
      this.chargeType = '';
      this.rating = 'null';
      this.comments = [];
      this.totalRatings = 0;
      this.totalComments = 0;
      this.numberOfStudent = 0;
      this.maxNumberOfStudent = 0;
      this.user = {};
      this.studentInfo = [];
      this.tutorList = [];
    }
}

module.exports = APIResponseClassModel;
