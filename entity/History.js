var Entity = require("./Entity");

class History extends Entity {
  constructor() {
    // Input tableName
    super('history');
    // Create All table attribute
    this.userId = 'null';
    this.lessonId = 'null';
    this.historyId = 'null';
    this.type = 'null';
  }
}

module.exports = History;
