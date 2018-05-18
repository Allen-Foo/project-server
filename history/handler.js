'use strict';
const APIResponseUserModel = require('../apiResponseModel/APIResponseUserModel');
const User = require('../entity/User');
const ServerConstant = require("../common/ServerConstant");
const Utilities = require('../common/Utilities');

module.exports.addToBookmark = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;
  const userId = event.userId;

  const classId = event.path.id;
  // get user profile by using awsId

  var response = new APIResponseUserModel();

  // check awsId valid
  if (!data.userId) {
    response.statusCode = ServerConstant.API_CODE_ACC_NOT_LINKED_AWS_ID;
    callback(null, response);
    return;
  }

  User.findFirst('userId = :userId', {':userId' : data.userId}, function(err, user) {
    if (err) {
      callback(err, null);
      return;
    } 
    if (user != null) {
      Utilities.bind(user, response);
      user.bookmark.push(classId)
      user.updatedAt = Utilities.getCurrentTime();
      user.saveOrUpdate(function(error, res) {
        if (error) {
          callback(error, null);
          return;
        }
        response.statusCode = ServerConstant.API_CODE_OK;
        Utilities.bind(res, response);
        callback(null, response);
      });
    }
    else {
      response.statusCode = ServerConstant.API_CODE_TARGET_USER_NOT_FOUND;
      callback(null, response);
      return;
    }
  });
};

module.exports.removeFromBookmark = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;
  const userId = event.userId;

  const classId = event.path.id;
  // get user profile by using awsId

  var response = new APIResponseUserModel();

  // check awsId valid
  if (!data.userId) {
    response.statusCode = ServerConstant.API_CODE_ACC_NOT_LINKED_AWS_ID;
    callback(null, response);
    return;
  }

  User.findFirst('userId = :userId', {':userId' : data.userId}, function(err, user) {
    if (err) {
      callback(err, null);
      return;
    } 
    if (user != null) {
      Utilities.bind(user, response);
      // remove the class id
      user.bookmark = user.bookmark.filter(clsId => clsId !== classId)
      user.updatedAt = Utilities.getCurrentTime();
      user.saveOrUpdate(function(error, res) {
        if (error) {
          callback(error, null);
          return;
        }
        response.statusCode = ServerConstant.API_CODE_OK;
        Utilities.bind(res, response);
        callback(null, response);
      });
    }
    else {
      response.statusCode = ServerConstant.API_CODE_TARGET_USER_NOT_FOUND;
      callback(null, response);
      return;
    }
  });
};