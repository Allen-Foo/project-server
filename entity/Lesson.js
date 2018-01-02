var Entity = require("./Entity");

class Lesson extends Entity {
  constructor() {
    // Input tableName
    super('Lesson');
    // Create All table attribute
    this.lessonId = 'null';
    this.lessonSize = 'null';
    this.lessonAddress = 'null';
    this.lessonDescription = 'null';
    this.lessonName = 'null';
    this.lessonTutorName = 'null';
    this.lessonCharge = 'null';
    this.lessonHoldDay = 'null';
    this.lessonFrequence = 'null';
    this.lessonOpeningTime = 'null';
    this.lessonClosingTime = 'null';
    this.createAt = 'null';
  }
}

module.exports = Lesson;
