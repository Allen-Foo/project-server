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
    this.bankAccountName = 'null';
    this.createdAt = '';
    this.isApproved = false;
    this.requestAmount = 0;
    this.withdrawnAmount = 0;
    this.adminFeeRate = 0;
    this.adminFee = 0;
    this.remainRevenue = 0;

  }
}

module.exports = Withdrawn;
