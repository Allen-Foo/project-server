var Entity = require("./Entity");

class CoinHistory extends Entity {
  constructor() {
    // Input tableName
    super('coin_history', 'coinHistoryId');
    // Create All table attribute
    this.coinHistoryId = 'null';
    this.userId = 'null';
    this.enAction = 'null';
    this.tcAction = 'null';
    this.scAction = 'null';
    this.gold = 0;
    this.createdAt = 'null';
    this.transactionId = 'null'; 
  }
}

module.exports = CoinHistory;
