var Entity = require("./Entity");

class Tutor extends Entity {
  constructor() {
    // Input tableName
    super('tutor', 'tutorId');
    // Create All table attribute
    this.tutorId = 'null';
    this.address = 'null';
    this.website = 'null';
    this.awsId = 'null';
    this.loginType = 'null';
    this.introduction = 'null';
    this.email = 'null';
    this.tutorName = 'null';
    this.username = 'null';
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
    this.userRole = 'null';
    this.companyId = 'null';
  }
}

module.exports = Tutor;
