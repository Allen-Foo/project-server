var Entity = require("./Entity");

class Transaction extends Entity {
  constructor() {
    // Input tableName
    super('transaction', 'transactionId');
    // Create All table attribute
    this.transactionId = 'null';
    this.userId = 'null';
    this.sku = 'null';
    this.amount = 0;
    this.paymentMethod = 'null';
    this.type = 'null';
    this.createdAt = 'null';
  }
}

module.exports = Transaction;
