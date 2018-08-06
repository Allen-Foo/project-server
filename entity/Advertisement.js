var Entity = require("./Entity");

class Advertisement extends Entity {
  constructor() {
    // Input tableName
    super('advertisement', 'advertisementId');
    // Create All table attribute
    this.advertisementId = 'null';
    this.imgUrl = 'null';
    this.url = 'null';
    this.createdAt = 'null';
    this.startedAt = 'null';
    this.finishedAt = 'null';
  }
}

module.exports = Advertisement;
