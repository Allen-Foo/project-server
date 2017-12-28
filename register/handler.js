'use strict';
const uuidv4 = require('uuid/v4');
const ServerConstant = require("../common/ServerConstant");
const User = require('../entity/User');
const APIResponseRegisterModel = require('../apiResponseModel/APIResponseRegisterModel');

module.exports.register = (event, context, callback) => {
  var response = new APIResponseRegisterModel();

  // check awsId valid
  if (!event.awsId.trim()) {
    response.statusCode = ServerConstant.API_CODE_ACC_NOT_LINKED_AWS_ID;
    callback(null, response);
  }

  // data validation
  if (!event.email.trim() || !event.fullName.trim()) {
    response.statusCode = ServerConstant.API_CODE_ACC_INVALID_FIELDS;
    callback(null, response);
  }

  // check duplicate email
  User.findFirst('email = :email', {':email' : event.email}, function(err, user) {
    if (err) callback(err, null);
    if (user == null) {
      var newUser = new User();
      Object.assign(newUser, event);
      newUser.userId = uuidv4();
      newUser.saveOrUpdate(function(err, user) {
        if (err) callback(err, null);
        response.statusCode = ServerConstant.API_CODE_OK;
        Object.assign(response, newUser);
        callback(null, response);
      });
    }
    else {
      response.statusCode = ServerConstant.API_CODE_ACC_DUPLICATE_EMAIL;
      callback(null, response);
    }
  });

};
