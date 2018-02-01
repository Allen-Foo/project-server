const AWS = require('aws-sdk');
const ServerConstant = require("./ServerConstant");
const moment = require('moment');
const fileType = require('file-type');
const sha1 = require('sha1');

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
    // parse the base64 string into a buffer
    var buffer = new Buffer(file, 'base64');
    // get file type
    var fileMime = fileType(buffer);

    if (fileMime === null) {
      return context.fail('The string supplied is not a file type');
    }

    let now = moment().format('YYYY-MM-DD HH:mm:ss');
    let fileName = sha1(new Buffer(now)) + '.' + fileMime.ext;

    var params = {Bucket: bucket, Key: fileName, Body: buffer};
    var upload = new AWS.S3.ManagedUpload({params: params});
    upload.send(function(err, data) {
      if (err) console.log(err)
      callback(err, data)
    });
  }

}

module.exports = Utilities;
