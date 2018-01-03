'use strict';
const APIResponseLoginModel = require('../apiResponseModel/APIResponseLoginModel');
const User = require('../entity/User');
const ServerConstant = require("../common/ServerConstant");
const Utilities = require('../common/Utilities');

module.exports.login = (event, context, callback) => {
  // get data from the body of event
  const data = JSON.parse(event.body);

  // get user profile by using awsId

  var response = new APIResponseLoginModel();

  // check awsId valid
  if (!data.awsId) {
    response.statusCode = ServerConstant.API_CODE_ACC_NOT_LINKED_AWS_ID;
    callback(null, response.toResponseFomat());
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
      callback(null, response.toResponseFomat());
      return;
    }
    else {
    	response.statusCode = ServerConstant.API_CODE_TARGET_USER_NOT_FOUND;
    	callback(null, response.toResponseFomat());
      return;
  	}
  });
};
