var Entity = require("./Entity");

class Class extends Entity {
  constructor() {
    // Input tableName
    super('class');
    // Create All table attribute
    this.category = 'null';
    this.skill = 'null';
    this.title = 'null';
    this.time = 'null';
    this.address = 'null';
    this.description = 'null';
    this.classId = 'null';
    this.photoList = 'null';
    this.userId = 'null';
    this.fee = 'null';
    this.chargeType = 'null';
  }
}

module.exports = Class;
