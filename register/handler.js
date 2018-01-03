'use strict';
const uuidv4 = require('uuid/v4');
const ServerConstant = require("../common/ServerConstant");
const User = require('../entity/User');
const APIResponseRegisterModel = require('../apiResponseModel/APIResponseRegisterModel');
const Utilities = require('../common/Utilities');

module.exports.register = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  var response = new APIResponseRegisterModel();

  // check awsId valid
  if (!data.awsId) {
    response.statusCode = ServerConstant.API_CODE_ACC_NOT_LINKED_AWS_ID;
    callback(null, response);
    return;
  }

  // data validation
  if (!data.email || !data.fullName) {
    response.statusCode = ServerConstant.API_CODE_ACC_INVALID_FIELDS;
    callback(null, response);
    return;
  }

  // check duplicate email
  User.findFirst('email = :email', {':email' : data.email}, function(err, user) {
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
        return;    
      });
    }
    else {
      response.statusCode = ServerConstant.API_CODE_ACC_DUPLICATE_EMAIL;
      callback(null, response);
      return;    
    }
  });

};
