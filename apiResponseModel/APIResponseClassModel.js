var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIResponseClassModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.title = '';
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

module.exports = APIResponseClassModel;
