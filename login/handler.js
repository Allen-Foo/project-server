'use strict';
const APIResponseLoginModel = require('../apiResponseModel/APIResponseLoginModel');
const User = require('../entity/User');
const ServerConstant = require("../common/ServerConstant");
const Utilities = require('../common/Utilities');

module.exports.login = (event, context, callback) => {

  // get user profile by using awsId

  var response = new APIResponseLoginModel();

  // check awsId valid
  if (!event.awsId.trim()) {
    response.statusCode = ServerConstant.API_CODE_ACC_NOT_LINKED_AWS_ID;
    callback(null, response);
  }

  User.findFirst('awsId = :awsId', {':awsId' : event.awsId}, function(err, user) {
    if (err) callback(err, null);
    	if (user != null) {
	      Utilities.bind(user, response);
	      response.statusCode = ServerConstant.API_CODE_OK;
	      callback(null, response);
	    }
      else {
      	response.statusCode = ServerConstant.API_CODE_TARGET_USER_NOT_FOUND;
      	callback(null, response);
    	}
    });
    
    

};
