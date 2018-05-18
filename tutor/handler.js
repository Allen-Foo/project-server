'use strict';
const uuidv4 = require('uuid/v4');
const ServerConstant = require("../common/ServerConstant");
const Class = require('../entity/Class');
const User = require('../entity/User');
const ApplyClass = require('../entity/ApplyClass')
const Tutor = require('../entity/Tutor')
const APIResponseTutorModel = require('../apiResponseModel/APIResponseTutorModel');
const Utilities = require('../common/Utilities');

module.exports.createTutor = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  console.log('data', data)

  let response = new APIResponseTutorModel();

  if (!data.userId) {
    response.statusCode = ServerConstant.API_CODE_ACC_UNAUTHORIZED;
    callback(null, response);
    return;
  }
	
  var newTutor = new Tutor();
  Utilities.bind(data, newTutor);
  newTutor.companyId = data.userId;
  newTutor.tutorId = uuidv4();
  newTutor.registerAt = Utilities.getCurrentTime();

  newTutor.saveOrUpdate(function(err, tutor) {
    if (err) {
      callback(err, null);
      return;
    }
    response.statusCode = ServerConstant.API_CODE_OK;
    Utilities.bind(tutor, response);
    callback(null, response);
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
