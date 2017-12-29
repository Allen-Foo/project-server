const ServerConstant = require("./ServerConstant");

Class Utilties() {
  static bind() {
    // A function bind two object

    var a = {a:0 , b:0}
    var b = {a:1 , b:2 , c:10}

    a.id = b.id
    a.name = b.name

    Utilties.bind (a, b)

    a = {a:1 , b:2};
  }
}
