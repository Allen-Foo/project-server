var Entity = require("./Entity");

class Calendar extends Entity {
  constructor() {
    // Input tableName
    super('calendar', 'calendarId');
    // Create All table attribute
    this.userId = 'null';
    this.lessonId = 'null';
    this.calendarId = 'null';
    this.lessonDate = 'null';
    this.startTime = 'null';
    this.endTime = 'null';
    this.isTutor = 'null';
    this.userRole = 'null';
  }
}

module.exports = Calendar;
