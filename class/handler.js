'use strict';
const uuidv4 = require('uuid/v4');
const ServerConstant = require("../common/ServerConstant");
const Class = require('../entity/Class');
const User = require('../entity/User');
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
        console.log (classes);
    var comments = classes.comments;
    var userIds = [];
    for (var key in comments){
      userIds.push(comments[key].userId);
    }
    var expressionAttibuteValues = {};
    var index = 0;
    userIds.forEach(function(value) {
      index++;
      var titleKey = ":userId"+index;
      expressionAttibuteValues[titleKey.toString()] = value;
    });

    console.log (expressionAttibuteValues);
    var filterExpression = 'userId IN (' + Object.keys(expressionAttibuteValues).toString() + ')';

    User.findAll(filterExpression, expressionAttibuteValues, 20, function(err, users) {

      var tmp = classes;

      for (var commentKey in tmp.comments) {
        for (var userKey in users) {
          if (users[userKey].userId == tmp.comments[commentKey].userId) {
            tmp.comments[commentKey].user = users[userKey];
            delete tmp.comments[commentKey].userId
            break;
          }
        } 
      }

      // console.log(users);
      response.statusCode = ServerConstant.API_CODE_OK;
      Utilities.bind(tmp, response);
      callback(null, response);
      return;
    });

  });
};

module.exports.deleteClass = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;
  const classId = event.path.id;

  let response = new APIResponseClassModel();

  Class.findFirst('classId = :classId', {':classId' : classId}, function(err, classes) {

    if (err) {
      callback(err, null);
      return;
    }

    // console.warn('classes', classes)

    classes.delete(function(error, res) {
      if (error) {
        callback(error, null);
        return;
      }
      response.statusCode = ServerConstant.API_CODE_OK;
      Utilities.bind(classes, response);
      callback(null, response);
    })
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
      if (obj == 'address' && data[obj]){
        exp.push(`contains(address.formatted_address, :${obj})`);
        expressionValue[":"+obj] = data[obj];
      } else if (obj == 'keyword' && data[obj]){
        exp.push(`(contains(className, :className) or contains(category, :category) or contains(skill, :skill))`);
        expressionValue[':className'] = data[obj];
        expressionValue[':category'] = data[obj];
        expressionValue[':skill'] = data[obj];
      }
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

module.exports.giveComment = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;
  const classId = event.path.id;
  let response = new APIResponseClassModel();

  Class.findFirst('classId = :classId', {':classId' : classId}, function(err, classes) {

    if (err) {
      callback(err, null);
      return;
    }

    classes.comments.push({
      content: data.comment,
      createdAt: Utilities.getCurrentTime(),
      userId: data.userId
    });
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
