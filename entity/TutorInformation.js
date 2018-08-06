var Entity = require("./Entity");

class TutorInformation extends Entity {
  constructor() {
    // Input tableName
    super('tutor_information', 'userId');
    // Create All table attribute
    this.userId = 'null';
    this.selfIntro = 'null';
    this.experience = '';
    this.achievementList = '';
    this.profession = '';
    this.revenue = 0;
    this.pendingRevenue = 0;
  }
}

module.exports = TutorInformation;
