var Entity = require("./Entity");

class Setting extends Entity {
  constructor() {
    // Input tableName
    super('setting', 'settingId');
    // Create All table attribute
    this.settingId = 'null';
    this.version = 'null';
  }
}

module.exports = Setting;
