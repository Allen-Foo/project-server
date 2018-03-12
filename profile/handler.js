var AWS = require('aws-sdk');
const s3 = new AWS.S3();
var Utilities = require('../common/Utilities');
const ServerConstant = require("../common/ServerConstant");
const User = require('../entity/User');
const ApiResponseUserModel = require('../apiResponseModel/ApiResponseUserModel');

module.exports.updateProfile = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

	var response = new ApiResponseUserModel();
  // update dynamoDb
  User.findFirst('awsId = :awsId', {':awsId' : data.awsId}, function(err, user) {
    if (err || user == null) {
      callback(err, null);
      return;
    }
    console.log('data.user', data.user)

  	Utilities.bind(data.user, user);
  	// update profile

    user.saveOrUpdate(function(err, user) {
      if (err) {
        callback(err, null);
        return;
      }
      response.statusCode = ServerConstant.API_CODE_OK;
      Utilities.bind(user, response);
      callback(null, response);
    });
	})
};