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
    response.statusCode = ServerConstant.API_CODE_OK;
    Utilities.bind(classes, response);
    callback(null, response);
  })
};

module.exports.getFavouriteClassList = (event, context, callback) => {
  const data = event.body;
  let response = new APIResponseClassListModel();
  var ids = data;

  if (!Array.isArray(ids)) {
    response.statusCode = ServerConstant.API_CODE_INVALID_PARAMS;
    callback(null, response);
  } else if (ids.length === 0) {
    response.statusCode = ServerConstant.API_CODE_OK;
    response.classList = [];
    callback(null, response);
  } else {
    var expressionAttibuteValues = {};
    ids.forEach((value, index) => expressionAttibuteValues[":classId" + index] = value);

    console.log('expressionAttibuteValues', expressionAttibuteValues);
    var filterExpression = `classId IN (${Object.keys(expressionAttibuteValues).toString()})`;

    console.log('filterExpression', filterExpression)

    Class.findAll(filterExpression, expressionAttibuteValues, 20, function(err, classList) {
      if (err) {
        callback(err, null);
      } else {
        console.warn('classList', classList)
        classList.forEach(cls => cls.liked = true)
        response.statusCode = ServerConstant.API_CODE_OK;
        Utilities.bind({classList}, response);
        callback(null, response);
      }
    });
  }
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
  let newComment = data.comment;
  const classId = event.path.id;
  let response = new APIResponseClassModel();

  Class.findFirst('classId = :classId', {':classId' : classId}, function(err, classes) {

    if (err) {
      callback(err, null);
      return;
    }

    User.findFirst('userId = :userId', {':userId' : data.userId}, function(err, user) {
      if (err) {
        callback(err, null);
        return;
      }
      let comments = classes.comments || []
      comments.push({
        rating: newComment.rating,
        content: newComment.content,
        createdAt: Utilities.getCurrentTime(),
        user: user
      });

      // calculate the average ratings
      let totalRatings = {};
      Object.keys(newComment.rating).forEach(key => totalRatings[key] = 0)

      console.log('comments', comments)

      comments.forEach((comment) => {
        Object.keys(comment.rating).forEach((key, index) => {
          let tempRating = comment.rating ? comment.rating[key] : 0
          totalRatings[key] += tempRating
        })
      })

      let averageRatings = {}
      console.log('totalRatings', totalRatings)


      Object.keys(totalRatings).forEach(key => averageRatings[key] = totalRatings[key] / comments.length )
      console.log('averageRatings', averageRatings)

      classes.rating = averageRatings
      classes.comments = comments;

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
    });
  })
};
