var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIResponseApplyClassModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.applyId = '';
      this.numberOfStudent = 0;
      this.className = '';
      this.registerAt = '';
      this.classId = '';
      this.userId = '';
      this.userName = '';
      this.tutorId = '';
      this.tutorName = '';
      this.photoList = 'null';
      this.address = 'null';
      this.classTimeList = [];
      this.user = {};
    }
}

module.exports = APIResponseApplyClassModel;
