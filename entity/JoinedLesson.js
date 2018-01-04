var Entity = require("./Entity");

class JoinedLesson extends Entity {
  constructor() {
    // Input tableName
    super('joinedLesson');
    // Create All table attribute
    this.userId = 'null';
    this.lessonId = 'null';
    this.joinedLessonId = 'null';
    this.joinedDate = 'null';
  }
}

module.exports = JoinedLesson;
