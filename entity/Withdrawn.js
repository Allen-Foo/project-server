var Entity = require("./Entity");

class Withdrawn extends Entity {
  constructor() {
    // Input tableName
    super('withdrawn', 'withdrawnId');
    // Create All table attribute
    this.withdrawnId = 'null';
    this.userId = 'null';
    this.tutorName = 'null';
    this.bankName = 'null';
    this.bankAccount = 'null';
    this.amount = 0;
    this.createdAt = '';
    this.isApproved = false;

  }
}

module.exports = Withdrawn;
