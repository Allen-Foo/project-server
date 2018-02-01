var AWS = require('aws-sdk');
const s3 = new AWS.S3();
var Utilities = require('../common/Utilities');
const ServerConstant = require("../common/ServerConstant");
const User = require('../entity/User');
const APIResponseRegisterModel = require('../apiResponseModel/APIResponseRegisterModel');

module.exports.updateAvatar = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  Utilities.uploadFile('aws-test-dev-uploads', data.key, data.file, (err, result) => {
    if (err) {
      callback(err, null);
      return;
    }
  	var response = new APIResponseRegisterModel();
    // callback(null, result);
    console.log('s3 result', result)
    // update dynamoDb
    User.findFirst('awsId = :awsId', {':awsId' : data.awsId}, function(err, user) {
	    if (err || user == null) {
	      callback(err, null);
	      return;
	    }

	    var newUser = new User();
		Utilities.bind(user, newUser);
		// update avatarUrl
		newUser.avatarUrl = result.Location

	    newUser.saveOrUpdate(function(err, user) {
        if (err) {
          callback(err, null);
          return;
        }
        response.statusCode = ServerConstant.API_CODE_OK;
        Utilities.bind(newUser, response);
        callback(null, response);
      });
	})
  })
};