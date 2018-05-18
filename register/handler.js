'use strict';
const uuidv4 = require('uuid/v4');
const ServerConstant = require("../common/ServerConstant");
const User = require('../entity/User');
const APIResponseUserModel = require('../apiResponseModel/APIResponseUserModel');
const Utilities = require('../common/Utilities');

module.exports.register = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  var response = new APIResponseUserModel();

  // check awsId valid
  if (!data.awsId) {
    response.statusCode = ServerConstant.API_CODE_ACC_NOT_LINKED_AWS_ID;
    callback(null, response);
    return;
  }

  // data validation
  if (!data.email || !data.username) {
    response.statusCode = ServerConstant.API_CODE_ACC_INVALID_FIELDS;
    callback(null, response);
    return;
  }

  // check duplicate email
  User.findFirst('awsId = :awsId', {':awsId' : data.awsId}, function(err, user) {
    if (err) {
      callback(err, null);
      return;
    } 
    if (user == null) {
      var newUser = new User();
      Utilities.bind(data, newUser);
      newUser.registerAt = Utilities.getCurrentTime();
      newUser.userId = uuidv4();
      newUser.saveOrUpdate(function(err, user) {
        if (err) {
          callback(err, null);
          return;
        }
        response.statusCode = ServerConstant.API_CODE_OK;
        Utilities.bind(newUser, response);
        callback(null, response);
      });
    } else {
      if (data.loginType === 'email') {
        console.log('user login by email:', data.email)
        response.statusCode = ServerConstant.API_CODE_ACC_DUPLICATE_EMAIL;
        callback(null, response);  
      } else {
        // Facebook or Google login will use this api, the first time will trigger registration,
        // then the second time will trigger this, something like login
        console.log('user login by ' + data.loginType + ':' + data.email)
        Utilities.bind(user, response);
        response.statusCode = ServerConstant.API_CODE_OK;
        callback(null, response);
      }
    }
  });

};
