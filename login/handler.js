'use strict';
const APIResponseUserModel = require('../apiResponseModel/APIResponseUserModel');
const User = require('../entity/User');
const ServerConstant = require("../common/ServerConstant");
const Utilities = require('../common/Utilities');

module.exports.login = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  // get user profile by using awsId

  var response = new APIResponseUserModel();

  // check awsId valid
  if (!data.awsId) {
    response.statusCode = ServerConstant.API_CODE_ACC_NOT_LINKED_AWS_ID;
    callback(null, response);
    return;
  }

  User.findFirst('awsId = :awsId', {':awsId' : data.awsId}, function(err, user) {
    if (err) {
      callback(err, null);
      return;
    } 
  	if (user != null) {
      Utilities.bind(user, response);
      response.statusCode = ServerConstant.API_CODE_OK;
      callback(null, response);
      return;
    }
    else {
    	response.statusCode = ServerConstant.API_CODE_TARGET_USER_NOT_FOUND;
    	callback(null, response);
      return;
  	}
  });
};
