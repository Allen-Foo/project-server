var Entity = require("./Entity");

class Transaction extends Entity {
  constructor() {
    // Input tableName
    super('transaction', 'transactionId');
    // Create All table attribute
    this.userId = 'null';
    this.lessonId = 'null';
    this.transactionId = 'null';
    this.startDate = 'null';
    this.endDate = 'null';
    this.totalPayment = 'null';
  }
}

module.exports = JoinedLesson;
