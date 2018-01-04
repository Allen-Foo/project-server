var Entity = require("./Entity");

class Lesson extends Entity {
  constructor() {
    // Input tableName
    super('lesson');
    // Create All table attribute
    this.lessonId = 'null';
    this.lessonSize = 'null';
    this.lessonAddress = 'null';
    this.lessonDescription = 'null';
    this.lessonName = 'null';
    this.tutorFirstName = 'null';
    this.tutorLastName = 'null';
    this.lessonCharge = 'null';
    this.startDate = 'null';
    this.endDate = 'null';
    this.lessonFrequence = 'null';
    this.startTime = 'null';
    this.endTime = 'null';
    this.userId = 'null';
    this.skillId = 'null';
    this.skillName = 'null';
    this.categoryId = 'null';
    this.categoryName = 'null';
    this.createAt = 'null';
  }
}

module.exports = Lesson;
