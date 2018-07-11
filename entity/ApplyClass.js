var Entity = require("./Entity");

class ApplyClass extends Entity {
  constructor() {
    // Input tableName, hashkey
    super('apply_class', 'applyId');
    // Create All table attribute
    this.applyId = 'null';
    this.numberOfStudent = 0;
    this.className = 'null';
    this.registerAt = 'null';
    this.classId = 'null';
    this.userId = 'null';
    this.userName = 'null';
    this.tutorId = 'null';
    this.tutorName = 'null';
    this.photoList = 'null';
    this.address = 'null';
    this.time = [];
    this.title = 'null';
    this.transactionId = 'null';
    this.progress = 'null';
  }
}

module.exports = ApplyClass;
