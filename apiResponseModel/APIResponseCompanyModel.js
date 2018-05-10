var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIResponseCompanyModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.category = '';
      this.skill = '';
      this.companyName = '';
      this.address = '';
      this.phone = '';
      this.companyDesc = '';
      this.companyId = '';
      this.companyPhotoList = [];
      this.chargeType = '';
      this.comments = [];
      this.companyRating = 'null';
      this.totalCompanyRating = [];
      this.totalComments = 0;

      // class
      this.classList = [];

      // tutor
      this.tutorList = [];
    }
}

module.exports = APIResponseCompanyModel;