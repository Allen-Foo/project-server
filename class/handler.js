'use strict';
const uuidv4 = require('uuid/v4');
const ServerConstant = require("../common/ServerConstant");
const Class = require('../entity/Class');
const APIRsponseClassListModel = require('../apiResponseModel/APIRsponseClassListModel');
const Utilities = require('../common/Utilities');

module.exports.createClass = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  let response = new APIRsponseClassListModel();

  // check userId valid
  if (!data.userId) {
    response.statusCode = ServerConstant.API_CODE_ACC_UNAUTHORIZED;
    callback(null, response);
    return;
  }

  // check duplicate email
  
  let newClass = new Class();
  Utilities.bind(data, newClass);
  newClass.createdAt = Utilities.getCurrentTime();
  newClass.classId = uuidv4();
  newClass.saveOrUpdate(function(err, res) {
    if (err) {
      callback(err, null);
      return;
    }
    response.statusCode = ServerConstant.API_CODE_OK;
    Utilities.bind(res, response);
    callback(null, response);
  });
};

module.exports.getClassList = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  let response = new APIRsponseClassListModel();

  Class.findAll('userId = :userId', {':userId' : data.userId}, 10, function(err, classList) {

    if (err) {
      callback(err, null);
      return;
    }
    response.statusCode = ServerConstant.API_CODE_OK;
    Utilities.bind({classList}, response);
    callback(null, response);
  })
};

