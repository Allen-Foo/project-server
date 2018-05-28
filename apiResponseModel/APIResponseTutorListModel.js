var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIResponseTutorListModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.tutorList = [];
    }
}

module.exports = APIResponseTutorListModel;
