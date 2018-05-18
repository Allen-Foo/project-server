'use strict';
const uuidv4 = require('uuid/v4');
const ServerConstant = require("../common/ServerConstant");
const Class = require('../entity/Class');
const User = require('../entity/User');
const ApplyClass = require('../entity/ApplyClass')
const Tutor = require('../entity/Tutor')
const APIResponseTutorModel = require('../apiResponseModel/APIResponseTutorModel');
const Utilities = require('../common/Utilities');

module.exports.tutor = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  let response = new APIResponseAppliedClassModel();

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
    Utilities.bind(data, company);
    var newTutor = new Tutor();
    newTutor.companyId = company.userId;
    newTutor.tutorId = uuidv4();
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
