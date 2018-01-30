var Entity = require("./Entity");

class User extends Entity {
  constructor() {
    // Input tableName
    super('user');
    // Create All table attribute
    this.userId = 'null';
    this.address = 'null';
    this.awsId = 'null';
    this.loginType = 'null';
    this.description = 'null';
    this.email = 'null';
    this.firstName = 'null';
    this.lastName = 'null';
    this.username = 'null';
    this.isTutor = false;
    this.phone = 'null';
    this.skill = 'null';
    this.calendarId = 'null';
    this.registerAt = 'null';
    this.googleId = 'null';
    this.facebookId = 'null';
    this.avatarUrl = 'null';
  }
}

module.exports = User;
