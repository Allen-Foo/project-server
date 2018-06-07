var Entity = require("./Entity");

class TutorInformation extends Entity {
  constructor() {
    // Input tableName
    super('tutor_information', 'userId');
    // Create All table attribute
    this.userId = 'null';
    this.selfIntro = '';
    this.experience = '';
    this.achievement = '';
    this.profession = '';
  }
}

module.exports = TutorInformation;
