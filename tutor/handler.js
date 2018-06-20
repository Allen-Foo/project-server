const uuidv4 = require('uuid/v4');
const ServerConstant = require("../common/ServerConstant");
const Class = require('../entity/Class');
const User = require('../entity/User');
const ApplyClass = require('../entity/ApplyClass')
const APIResponseUserModel = require('../apiResponseModel/APIResponseUserModel');
const APIResponseTutorListModel = require('../apiResponseModel/APIResponseTutorListModel');
const Utilities = require('../common/Utilities');


/**
 * @api {post} /createTutor Create Tutor
 * @apiName CreateTutor
 * @apiGroup Tutor
 *
 * @apiParam {String} userId Company's unique ID (userId).
 * @apiParam {Object} tutorData the tutor information for the new tutor
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
 * @apiError NotAuthorizied The id of the company user was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Not Authorized
 *     {
 *       "error": "NotAuthorizied"
 *     }
 */
module.exports.createTutor = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  let response = new APIResponseUserModel();

  if (!data.userId) {
    response.statusCode = ServerConstant.API_CODE_ACC_UNAUTHORIZED;
    callback(null, response);
    return;
  }
  
  //find user information
  User.findFirst('userId = :userId', {':userId' : data.userId}, function(err, company) {
    if (err) {
      callback(err, null);
      return;
    }
    var newTutor = new User();
    Utilities.bind(data.tutorData, newTutor);
    newTutor.companyId = data.userId;
    newTutor.userId = uuidv4();
    newTutor.userRole = 'tutor';
    newTutor.registerAt = Utilities.getCurrentTime();

    newTutor.saveOrUpdate(function(err, Tutor) {
      if (err) {
        callback(err, null);
        return;
      }
      response.statusCode = ServerConstant.API_CODE_OK;
      Utilities.bind(Tutor, response);
      callback(null, response);
    })
  });
};


/**
 * @api {post} /updateTutor Update Tutor
 * @apiName updateTutor
 * @apiGroup Tutor
 *
 * @apiParam {String} userId Users unique ID.
 * @apiParam {Object} data the tutor information
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
 * @apiError NotAuthorizied The id of the tutor was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Not Authorized
 *     {
 *       "error": "NotAuthorizied"
 *     }
 */
module.exports.updateTutor = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  let response = new APIResponseUserModel();

  if (!data.userId) {
    response.statusCode = ServerConstant.API_CODE_ACC_UNAUTHORIZED;
    callback(null, response);
    return;
  }
  
  //find user information
  User.findFirst('userId = :userId', {':userId' : data.userId}, function(err, tutor) {
    if (err) {
      callback(err, null);
      return;
    }
    Utilities.bind(data, tutor);

    tutor.saveOrUpdate(function(err, Tutor) {
      if (err) {
        callback(err, null);
        return;
      }
      response.statusCode = ServerConstant.API_CODE_OK;
      Utilities.bind(Tutor, response);
      callback(null, response);
    })
  });
};


/**
 * @api {post} /getTutorList Get Tutor List
 * @apiName getTutorList
 * @apiGroup Tutor
 *
 * @apiParam {String} userId Users unique ID.
 *
 * @apiSuccess {Number} statusCode statusCode of response.
 * @apiSuccess {String} companyId  companyId of the User.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "statusCode": 200,
 *        "tutorList": []
 *      }
 *
 * @apiError NotAuthorizied The id of the tutor was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Not Authorized
 *     {
 *       "error": "NotAuthorizied"
 *     }
 */
module.exports.getTutorList = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  if (!data.userId) {
    response.statusCode = ServerConstant.API_CODE_INVALID_PARAMS;
    callback(null, response);
    return;
  }

  let response = new APIResponseTutorListModel();
  let lastEvaluatedKey = data && data.lastStartKey ?  {tutorId: data.lastStartKey} : null;
  let isLastTutor = false;

  User.findAll('companyId = :userId', {':userId' : data.userId}, lastEvaluatedKey, 10, function(err, tutorList) {

    if (err) {
      callback(err, null);
      return;
    }
    if (tutorList.length < 10){
      isLastTutor = true
    }
    response.statusCode = ServerConstant.API_CODE_OK;
    Utilities.bind({tutorList}, response);
    response.isLastTutor = isLastTutor;
    callback(null, response);
  })
};

/**
 * @api {post} /deleteTutor Delete Tutor
 * @apiName deleteTutor
 * @apiGroup Tutor
 *
 * @apiParam {String} userId tutor unique ID.
 *
 * @apiSuccess {Number} statusCode statusCode of response.
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
 *     }
 *
 * @apiError InvalidParams The id of the tutor was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 203 API_CODE_INVALID_PARAMS
 *     {
 *       "error": "API_CODE_INVALID_PARAMS"
 *     }
 */
module.exports.deleteTutor = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;
  const userId = event.path.id;

  let response = new APIResponseUserModel();

  User.findFirst('userId = :userId', {':userId' : userId}, function(err, tutor) {

    if (err) {
      callback(err, null);
      return;
    }

    // console.warn('classes', classes)

    tutor.delete(function(error, res) {
      if (error) {
        callback(error, null);
        return;
      }
      response.statusCode = ServerConstant.API_CODE_OK;
      Utilities.bind(tutor, response);
      callback(null, response);
    })
  })
};
