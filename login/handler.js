'use strict';
const APIResponseLoginModel = require('../apiResponseModel/APIResponseLoginModel');
const User = require('../entity/User');
const ServerConstant = require("../common/ServerConstant");

module.exports.login = (event, context, callback) => {

  // var user = new User();

  var response = new APIResponseLoginModel();

  callback(null, response);
};
