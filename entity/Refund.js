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
    this.createdAt = 'null';
    this.progress = 'processing';
    this.transactionId = 'null';
    this.refundRate = 0;
    this.adminFeeRate = 0;
    this.adminFee = 0;
    this.classFee = 0;
    this.requestAmount = 0;
    this.refundAmount = 0;

  }
}

module.exports = Refund;
