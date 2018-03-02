'use strict';
const uuidv4 = require('uuid/v4');
const ServerConstant = require("../common/ServerConstant");
const Class = require('../entity/Class');
const APIResponseClassModel = require('../apiResponseModel/APIResponseClassModel');
const APIResponseClassListModel = require('../apiResponseModel/APIResponseClassListModel');
const Utilities = require('../common/Utilities');

module.exports.createClass = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  let response = new APIResponseClassListModel();

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

module.exports.updateClass = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;
  const classId = event.path.id;

  let response = new APIResponseClassModel();

  // check userId valid
  if (!data.userId) {
    response.statusCode = ServerConstant.API_CODE_ACC_UNAUTHORIZED;
    callback(null, response);
    return;
  }

  Class.findFirst('classId = :classId', {':classId' : classId}, function(err, classes) {

    if (err) {
      callback(err, null);
      return;
    }

    Utilities.bind(data, classes);
    classes.updatedAt = Utilities.getCurrentTime();
    classes.saveOrUpdate(function(error, res) {
      if (error) {
        callback(error, null);
        return;
      }
      response.statusCode = ServerConstant.API_CODE_OK;
      Utilities.bind(res, response);
      callback(null, response);
    });
  })
};

module.exports.getClassList = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  let response = new APIResponseClassListModel();

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

module.exports.getClassDetail = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;
  const classId = event.path.id;

  let response = new APIResponseClassModel();

  Class.findFirst('classId = :classId', {':classId' : classId}, function(err, classes) {

    if (err) {
      callback(err, null);
      return;
    }
    response.statusCode = ServerConstant.API_CODE_OK;
    Utilities.bind(classes, response);
    callback(null, response);
  })
};

module.exports.getAllClassList = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  let response = new APIResponseClassListModel();

  Class.findAll(null, null, 20, function(err, classList) {

    if (err) {
      callback(err, null);
      return;
    }
    response.statusCode = ServerConstant.API_CODE_OK;
    Utilities.bind({classList}, response);
    callback(null, response);
  })
};

module.exports.searchClassList = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;
  let response = new APIResponseClassListModel();

  if (data) {
    let exp = [];
    let expressionValue = {};
    for (var obj in data) {
      if (obj == 'address'){
        exp.push(`contains(address.formatted_address, :${obj})`);
      } else {
        exp.push(`contains(${obj}, :${obj})`);
      }
      expressionValue[":"+obj] = data[obj];
     
    }
    var expression = exp.join(' and ')
    console.log("expression ", expression);
    console.log("expressionValue ", expressionValue);
    Class.findAll(expression, expressionValue, 20, function(err, classList) {

      if (err) {
        callback(err, null);
        return;
      }
      response.statusCode = ServerConstant.API_CODE_OK;
      Utilities.bind({classList}, response);
      callback(null, response);
    })
  } else {

    Class.findAll(null, null, 20, function(err, classList) {

      if (err) {
        callback(err, null);
        return;
      }
      response.statusCode = ServerConstant.API_CODE_OK;
      Utilities.bind({classList}, response);
      callback(null, response);
    })
  }
};
