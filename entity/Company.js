var Entity = require("./Entity");

class Company extends Entity {
  constructor() {
    // Input tableName, hashkey
    super('company', 'companyId');
    // Create All table attribute
    // company
    this.category = 'null';
    this.skill = 'null';
    this.companyName = 'null';
    this.address = 'null';
    this.phone = 'null';
    this.companyDesc = 'null';
    this.companyId = 'null';
    this.companyPhotoList = 'null';
    this.chargeType = 'null';
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

module.exports = Company;
