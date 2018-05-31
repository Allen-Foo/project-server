const uuidv4 = require('uuid/v4');
const ServerConstant = require("../common/ServerConstant");
const Class = require('../entity/Class');
const User = require('../entity/User');
const ApplyClass = require('../entity/ApplyClass')
const Tutor = require('../entity/Tutor')
const APIResponseTutorModel = require('../apiResponseModel/APIResponseTutorModel');
const APIResponseTutorListModel = require('../apiResponseModel/APIResponseTutorListModel');
const Utilities = require('../common/Utilities');

module.exports.createTutor = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  let response = new APIResponseTutorModel();

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
    var newTutor = new Tutor();
    Utilities.bind(data.tutorData, newTutor);
    newTutor.companyId = data.userId;
    newTutor.tutorId = uuidv4();
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

module.exports.getTutorList = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  let response = new APIResponseTutorListModel();
  let lastEvaluatedKey = data && data.lastStartKey ?  {tutorId: data.lastStartKey} : null;
  let isLastTutor = false;

  Tutor.findAll('companyId = :userId', {':userId' : data.userId}, lastEvaluatedKey, 10, function(err, tutorList) {

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

module.exports.deleteTutor = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;
  const tutorId = event.path.id;

  let response = new APIResponseTutorModel();

  Tutor.findFirst('tutorId = :tutorId', {':tutorId' : tutorId}, function(err, tutor) {

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
