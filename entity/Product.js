var Entity = require("./Entity");

class Product extends Entity {
  constructor() {
    // Input tableName
    super('product', 'productId');
    // Create All table attribute
    this.productId = 'null';
    this.name = 'null';
    this.gold = 0;
    this.price = 0;
  }
}

module.exports = Product;
