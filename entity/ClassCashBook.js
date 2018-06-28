var Entity = require("./Entity");

class ClassCashBook extends Entity {
  constructor() {
    // Input tableName
    super('class_cash_book', 'classCashBookId');
    // Create All table attribute
    this.classCashBookId = 'null';
    this.userId = 'null';
    this.classId = 'null';
    this.paymentList = [];
    this.isDirty = false;
    this.availableAt = 'null';
    this.availableDate = 'null';
    this.isOpen = true;
  }
}

module.exports = ClassCashBook;
