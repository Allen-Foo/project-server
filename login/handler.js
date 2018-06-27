'use strict';
const APIResponseUserModel = require('../apiResponseModel/APIResponseUserModel');
const User = require('../entity/User');
const ServerConstant = require("../common/ServerConstant");
const Utilities = require('../common/Utilities');


/**
 * @api {post} /login Login
 * @apiName login
 * @apiGroup Login
 *
 * @apiParam {String} awsId Users awsId.
 *
 * @apiSuccess {String} userId userId of the User.
 * @apiSuccess {String} companyId  companyId of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "statusCode": 200,
 *        "userId": "21bc0ea1-0a09-4c1c-a782-a1bd42f68b31",
 *        "maintenanceSchedule": "",
 *        "email": "null",
 *        "username": "test create tutor",
 *        "name": "null",
 *        "website": "null",
 *        "phone": "null",
 *        "address": "null",
 *        "isTutor": false,
 *        "skill": "null",
 *        "introduction": "null",
 *        "awsId": "null",
 *        "loginType": "null",
 *        "googleId": "null",
 *        "facebookId": "null",
 *        "avatarUrl": "null",
 *        "bookmark": [],
 *        "totalRatings": 0,
 *        "userRole": "tutor",
 *        "gold": 0,
 *        "freeGold": 0,
 *        "companyId": "49eaeb42-bc5f-4dae-a45c-0dfbfda5231c"
 *      }
 *
 * @apiError NotLinkedAwsId The id of the aws was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Not linked to aws id
 *     {
 *       "error": "API_CODE_ACC_NOT_LINKED_AWS_ID"
 *     }
 *     
 * @apiError NotLinkedAwsId Cannot find the user.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 202 Target user not found
 *     {
 *       "error": "API_CODE_TARGET_USER_NOT_FOUND"
 *     }
 */
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
      // New User
      User.findFirst('username = :username', {':username' : data.username}, function(err, user) {
        if (err) {
          callback(err, null);
          return;
        } 
        if (user == null) {
          response.statusCode = ServerConstant.API_CODE_TARGET_USER_NOT_FOUND;
          callback(null, response);
          return;
        }
        else {
          user.awsId = data.awsId;
          user.saveOrUpdate(function(err, user) {
            if (err) {
              callback(err, null);
              return;
            }
  
            response.statusCode = ServerConstant.API_CODE_OK;
            Utilities.bind(user, response);
  
            callback(null, response);
          });
        }
      });
    }
  });
};
