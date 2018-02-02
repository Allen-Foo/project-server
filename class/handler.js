'use strict';
const uuidv4 = require('uuid/v4');
const ServerConstant = require("../common/ServerConstant");
const Class = require('../entity/Class');
const APIRsponseClassModel = require('../apiResponseModel/APIRsponseClassModel');
const Utilities = require('../common/Utilities');

module.exports.createClass = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  var response = new APIRsponseClassModel();

  // check classId valid
  // if (!data.classId) {
  //   response.statusCode = ServerConstant.API_CODE_ACC_NOT_LINKED_AWS_ID;
  //   callback(null, response);
  //   return;
  // }

  // check duplicate email
  
  var newClass = new Class();
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

