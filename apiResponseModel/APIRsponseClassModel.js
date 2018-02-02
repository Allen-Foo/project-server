var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIRsponseClassModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.category = '';
      this.skill = '';
      this.time = '';
      this.address = '';
      this.description = '';
      this.photoList = '';
      this.fee = '';
      this.classId = '';
      this.userId = '';
    }
}

module.exports = APIRsponseClassModel;
