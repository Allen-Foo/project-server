'use strict';
const uuidv4 = require('uuid/v4');
const ServerConstant = require("../common/ServerConstant");
const User = require('../entity/User');
const TutorInformation = require('../entity/TutorInformation');
const CompanyInformation = require('../entity/CompanyInformation');
const APIResponseUserModel = require('../apiResponseModel/APIResponseUserModel');
const Utilities = require('../common/Utilities');

function saveOrUpdateUserTable(data, response, callback) {
  var newUser = new User();
  Utilities.bind(data.user, newUser);
  newUser.registerAt = Utilities.getCurrentTime();
  newUser.userId = uuidv4();
  newUser.name = data.user.username;
  newUser.saveOrUpdate(function(err, user) {
    if (err) {
      callback(err, null);
      return;
    }
    Utilities.bind(newUser, response);

    if (data.user.userRole === 'tutor') {
      if (!data.extraInfo) {
        response.statusCode = ServerConstant.API_CODE_ACC_INVALID_FIELDS;
        callback(null, response);
        return;
      }
      
      var tutorInformation = new TutorInformation ();

      Utilities.bind(data.extraInfo, tutorInformation);
      tutorInformation.userId = newUser.userId;

      tutorInformation.saveOrUpdate(function(err, info) {
        if (err) {
          callback(err, null);
          return;
        }

        response.statusCode = ServerConstant.API_CODE_OK;
        callback(null, response);

      });
    } else if (data.user.userRole === 'company') {
      if (!data.extraInfo) {
        response.statusCode = ServerConstant.API_CODE_ACC_INVALID_FIELDS;
        callback(null, response);
        return;
      }
      
      var companyInformation = new CompanyInformation ();

      Utilities.bind(data.extraInfo, companyInformation);
      companyInformation.userId = newUser.userId;

      companyInformation.saveOrUpdate(function(err, info) {
        if (err) {
          callback(err, null);
          return;
        }

        response.statusCode = ServerConstant.API_CODE_OK;
        callback(null, response);

      });
    } else {
      response.statusCode = ServerConstant.API_CODE_OK;
      callback(null, response);
    }
  });
}

module.exports.register = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  var response = new APIResponseUserModel();

  // check awsId valid
  // if (!data.user.awsId) {
  //   response.statusCode = ServerConstant.API_CODE_ACC_NOT_LINKED_AWS_ID;
  //   callback(null, response);
  //   return;
  // }

  // data validation
  if (!data.user.email || !data.user.username) {
    response.statusCode = ServerConstant.API_CODE_ACC_INVALID_FIELDS;
    callback(null, response);
    return;
  }

  if (!data.user.awsId) {
    // New user
    saveOrUpdateUserTable(data, response, callback)
    return;
  }

  // check duplicate email
  User.findFirst('awsId = :awsId', {':awsId' : data.user.awsId}, function(err, user) {
    if (err) {
      callback(err, null);
      return;
    } 
    if (user == null) {
      saveOrUpdateUserTable(data, response, callback)
    } else {
      if (data.user.loginType === 'email') {
        console.log('user login by email:', data.user.email)
        response.statusCode = ServerConstant.API_CODE_ACC_DUPLICATE_EMAIL;
        callback(null, response);  
      } else {
        // Facebook or Google login will use this api, the first time will trigger registration,
        // then the second time will trigger this, something like login
        console.log('user login by ' + data.user.loginType + ':' + data.user.email)
        Utilities.bind(user, response);
        response.statusCode = ServerConstant.API_CODE_OK;
        callback(null, response);
      }
    }
  });

};

module.exports.validateNewUserInfo = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  var response = new APIResponseUserModel();

  // data validation
  if (!data.email || !data.username) {
    response.statusCode = ServerConstant.API_CODE_ACC_INVALID_FIELDS;
    callback(null, response);
    return;
  }

  // check duplicate email
  User.findFirst('email = :email or username = :username', {':email' : data.email, ':username' : data.username}, function(err, user) {
    if (err) {
      callback(err, null);
      return;
    } 
    if (user == null) {
      response.statusCode = ServerConstant.API_CODE_OK;
      callback(null, response);
    }
    else {
      if (user.username === data.username) {
        response.statusCode = ServerConstant.API_CODE_ACC_DUPLICATE_USERNAME;
        callback(null, response);  
      }
      else {
        response.statusCode = ServerConstant.API_CODE_ACC_DUPLICATE_EMAIL;
        callback(null, response);  
      }

      
    }
  });

};
