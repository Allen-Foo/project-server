var Entity = require("./Entity");

class User extends Entity {
  constructor() {
    // Input tableName
    super('user', 'userId');
    // Create All table attribute
    this.userId = 'null';
    this.address = 'null';
    this.website = 'null';
    this.awsId = 'null';
    this.loginType = 'null';
    this.introduction = 'null';
    this.email = 'null';
    this.name = 'null';
    this.username = 'null';
    this.isTutor = false;
    this.phone = 'null';
    this.skill = 'null';
    this.changePw = 'null';
    this.calendarId = 'null';
    this.registerAt = 'null';
    this.googleId = 'null';
    this.facebookId = 'null';
    this.avatarUrl = 'null';
    this.bookmark = [];
    this.totalRatings = 0;
  }
}

module.exports = User;
