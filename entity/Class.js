var Entity = require("./Entity");

class Class extends Entity {
  constructor() {
    // Input tableName, hashkey
    super('class', 'classId');
    // Create All table attribute
    this.category = 'null';
    this.skill = 'null';
    this.title = 'null';
    this.time = 'null';
    this.address = 'null';
    this.phone = 'null';
    this.description = 'null';
    this.classId = 'null';
    this.photoList = 'null';
    this.userId = 'null';
    this.fee = 0;
    this.chargeType = 'null';
    this.comments = [];
    this.rating = 'null';
    this.totalRatings = 0;
    this.totalComments = 0;
    this.numberOfStudent = 0;
    this.studentInfo = [];
    this.companyId = 'null';
  }
}

module.exports = Class;
