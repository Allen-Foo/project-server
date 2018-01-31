var AWS = require('aws-sdk');
const s3 = new AWS.S3();
var Utilities = require('../common/Utilities');

module.exports.upload = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  Utilities.uploadFile('aws-test-dev-uploads', data.key, data.file, (err, result) => {
    if (err) {
      callback(err, null);
      return;
    } 
    callback(null, result);
  })
};