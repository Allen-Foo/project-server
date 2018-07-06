var Entity = require("./Entity");

class Refund extends Entity {
  constructor() {
    // Input tableName
    super('refund', 'refundId');
    // Create All table attribute
    this.refundId = 'null';
    this.name = 'null';
    this.paypalAccount = 'null';
    this.className = 'null';
    this.tutorName = 'null';
    this.reason = 'null';
    this.amount = 0;
    this.createdAt = 'null';
    this.isApproved = false;
    this.transactionId = 'null'; 

  }
}

module.exports = Refund;
