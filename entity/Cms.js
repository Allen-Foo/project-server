var Entity = require("./Entity");

class Cms extends Entity {
  constructor() {
    // Input tableName, hashkey
    super('cms', 'id');
    // Create All table attribute
    this.subscriptionId = 'null';
  }
}

module.exports = Cms;
