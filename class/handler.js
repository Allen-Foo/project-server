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

    User.findFirst('userId = :userId', {':userId' : classes.userId}, function(err, user) {
      if (err) {
        callback(err, null);
        return;
      }
    classes.user = user
    response.statusCode = ServerConstant.API_CODE_OK;
    Utilities.bind(classes, response);
    callback(null, response);
    });

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

    // console.log('expressionAttibuteValues', expressionAttibuteValues);
    var filterExpression = `classId IN (${Object.keys(expressionAttibuteValues).toString()})`;

    // console.log('filterExpression', filterExpression)

    Class.findAll(filterExpression, expressionAttibuteValues, 20, function(err, classList) {
      if (err) {
        callback(err, null);
      } else {
        //console.warn('classList', classList)
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
        exp.push(`(contains(title, :className) or contains(category, :category) or contains(skill, :skill))`);
        expressionValue[':className'] = data[obj];
        expressionValue[':category'] = data[obj];
        expressionValue[':skill'] = data[obj];
      } else if (obj == 'advancedSearch' && data[obj]) {
        for (var key in data.advancedSearch) {
          if (data.advancedSearch[key] && key != "chargeType" && key != "sortType" && key != "isAscending") {
            if (key == 'searchPrice') {
              exp.push(`fee <= :${key}`);
              expressionValue[":"+key] = data.advancedSearch[key];
            }
            else if (key == 'address' && data.advancedSearch[key]) {
                exp.push(`contains(address.formatted_address, :${key})`);
                expressionValue[":"+key] = data.advancedSearch[key];
            } 
            else if (key == 'keyword' && data.advancedSearch[key]){
              exp.push(`(contains(className, :className) or contains(category, :category) or contains(skill, :skill))`);
              expressionValue[':className'] = data.advancedSearch[key];
              expressionValue[':category'] = data.advancedSearch[key];
              expressionValue[':skill'] = data.advancedSearch[key];
            }
            else {
              exp.push(`contains(${key}, :${key})`);
              expressionValue[":"+key] = data.advancedSearch[key];
            }
          }
        }
      }
    }

    var expression = exp.join(' and ')
    //
    if (exp.length === 0) {
      expression = null;
      expressionValue = null;
    }
    //called by 
    if (data.advancedSearch) {
      // 
      if (data.advancedSearch.sortType) {
        // console.log (data.advancedSearch.isAscending);
        Class.findAllByOrder(expression, expressionValue, 20, data.advancedSearch.sortType, data.advancedSearch.isAscending, function(err, classList) {

          if (err) {
            callback(err, null);
            return;
          }
          response.statusCode = ServerConstant.API_CODE_OK;
          Utilities.bind({classList}, response);
          callback(null, response);
        })
      }
      // sdfl
      else {
        Class.findAll(expression, expressionValue, 20, function(err, classList) {

          if (err) {
            callback(err, null);
            return;
          }
          response.statusCode = ServerConstant.API_CODE_OK;
          Utilities.bind({classList}, response);
          callback(null, response);
        })
      }
    } else {
      Class.findAll(expression, expressionValue, 20, function(err, classList) {

        if (err) {
          callback(err, null);
          return;
        }
        response.statusCode = ServerConstant.API_CODE_OK;
        Utilities.bind({classList}, response);
        callback(null, response);
      })
    }
    
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

      // console.log('comments', comments)

      comments.forEach((comment) => {
        Object.keys(comment.rating).forEach((key, index) => {
          let tempRating = comment.rating ? comment.rating[key] : 0
          totalRatings[key] += tempRating
        })
      })

      let averageRatings = {}
      // console.log('totalRatings', totalRatings)

      let totalNumberOfRatings = 0

      Object.keys(totalRatings).forEach(key => averageRatings[key] = totalRatings[key] / comments.length )
      Object.keys(averageRatings).forEach(key => totalNumberOfRatings += (averageRatings[key] / 4))
      // console.log('averageRatings', averageRatings)
      // console.log('totalRatings', totalRatings)
      // console.log('comments.length', comments.length)

      classes.totalRatings = totalNumberOfRatings
      classes.totalComments = comments.length
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
