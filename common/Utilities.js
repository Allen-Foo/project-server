const AWS = require('aws-sdk');
const ServerConstant = require("./ServerConstant");

class Utilities {
  static bind(objA, objB) {
    // A function combine a to b
    for (var b in objB) {
      if (objA[b]) {
        if (Object.keys(objB[b]).length > 0 && typeof objB[b] != "string")
          this.bind(objA[b], objB[b]);
        else
          objB[b] = objA[b];
      }
    }
  }

  static getCurrentTime() {
    var date = new Date(Date.now());
    return date.toString();
  }

  static uploadFile(bucket, key, file, callback) {
    var buffer = new Buffer(file.base64String, 'base64');

    var params = {Bucket: bucket, Key: key, Body: buffer};
    var upload = new AWS.S3.ManagedUpload({params: params});
    upload.send(function(err, data) {
      if (err) console.log(err)
      callback(err, data)
    });
  }
}

module.exports = Utilities;
