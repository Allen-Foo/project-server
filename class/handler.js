'use strict';
const uuidv4 = require('uuid/v4');
const ServerConstant = require("../common/ServerConstant");
const Class = require('../entity/Class');
const User = require('../entity/User');
const CoinHistory = require('../entity/CoinHistory');
const ClassCashBook = require('../entity/ClassCashBook');
const APIResponseClassModel = require('../apiResponseModel/APIResponseClassModel');
const APIResponseClassListModel = require('../apiResponseModel/APIResponseClassListModel');
const APIResponseCreateClassModel = require('../apiResponseModel/APIResponseCreateClassModel');
const Utilities = require('../common/Utilities');

module.exports.createClass = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  let response = new APIResponseCreateClassModel();

  // check userId valid
  if (!data.userId) {
    response.statusCode = ServerConstant.API_CODE_ACC_UNAUTHORIZED;
    callback(null, response);
    return;
  }

  User.findFirst('userId = :userId', {':userId' : data.userId}, function(err, user) {
    if (err) {
      callback(err, null);
      return;
    }
    if (user.gold + user.freeGold < ServerConstant.CREATE_CLASS_COINS && user.userRole != 'company') {
      response.statusCode = ServerConstant.API_CODE_CLASS_LACK_OF_COINS;
      callback(null, response);
      return;
    }

    if (user.userRole != 'company') {
      var tmp = user.freeGold - ServerConstant.CREATE_CLASS_COINS;
      user.freeGold = Math.max(0, tmp);
      if (tmp < 0) {
        user.gold += tmp;
      }
    }

    user.saveOrUpdate(function(err, user) {

      var coinHistory = new CoinHistory();
      coinHistory.userId = user.userId;
      coinHistory.coinHistoryId = uuidv4();
      coinHistory.createdAt = Utilities.getCurrentTime();
      coinHistory.gold = 0 - ServerConstant.CREATE_CLASS_COINS;
      coinHistory.enAction = 'Create Class';
      coinHistory.tcAction = '建立課堂';
      coinHistory.scAction = '建立课堂';
      coinHistory.saveOrUpdate(function (err, coinHistory) {
        if (err) {
          callback(err, null);
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

          var classCashBook = new ClassCashBook();
          classCashBook.classCashBookId = uuidv4();
          classCashBook.userId = res.userId;
          classCashBook.classId = res.classId;
          var tmpDateArray = Object.keys(res.time);
          tmpDateArray.forEach(function(part, index, theArray) {
            theArray[index] = new Date (part)
          });
          var tmpDate = new Date(Math.max(...tmpDateArray));
          tmpDate.setDate (tmpDate.getDate() + ServerConstant.THE_DAYS_CAN_GET_THE_REVENUE);
          classCashBook.availableAt = tmpDate.toString();
          classCashBook.availableDate = Date.parse(tmpDate);
          classCashBook.saveOrUpdate(function(err, classCashBook) {
            if (err) {
              callback(err, null);
              return;
            }
            response.statusCode = ServerConstant.API_CODE_OK;
            Utilities.bind(res, response);
            response.user = user;
            callback(null, response);
          });
        });
      });
    });
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
  let lastEvaluatedKey = data && data.lastStartKey ?  {classId: data.lastStartKey} : null;
  let isLastClass = false;

  Class.findAll('userId = :userId', {':userId' : data.userId}, lastEvaluatedKey, 10, function(err, classList) {

    if (err) {
      callback(err, null);
      return;
    }
    if (classList.length < 10){
      isLastClass = true
    }
    response.statusCode = ServerConstant.API_CODE_OK;
    Utilities.bind({classList}, response);
    response.isLastClass = isLastClass;
    callback(null, response);
  })
};

module.exports.getClassDetail = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;
  const classId = event.path.id;
  let lastEvaluatedKey = data && data.lastStartKey ?  {classId: data.lastStartKey} : null;
  let response = new APIResponseClassModel();

  Class.findFirst('classId = :classId', {':classId' : classId}, function(err, classes) {

    if (err) {
      callback(err, null);
      return;
    }
    //find tutor information
    User.findFirst('userId = :userId', {':userId' : classes.userId}, function(err, user) {
      if (err) {
        callback(err, null);
        return;
      }
      if (classes.studentInfo.length === 0) {
        Utilities.bind(classes, response);
        response.statusCode = ServerConstant.API_CODE_OK;
        response.studentInfo = [];
        response.user = user
        callback(null, response);
      } else {
          var expressionAttibuteValues = {};
          classes.studentInfo.forEach((value, index) => expressionAttibuteValues[":userId" + index] = value.userId);

          // console.log('expressionAttibuteValues', expressionAttibuteValues);
          var filterExpression = `userId IN (${Object.keys(expressionAttibuteValues).toString()})`;

          // console.log('filterExpression', filterExpression)

          User.findAll(filterExpression, expressionAttibuteValues, lastEvaluatedKey, 20, function(err, studentInfo) {
            if (err) {
              callback(err, null);
            } else {
              // console.warn('studentInfo', studentInfo)
              Utilities.bind(classes, response);
              response.statusCode = ServerConstant.API_CODE_OK;
              response.studentInfo = studentInfo
              response.user = user
              callback(null, response);
            }
        });
      }
    })
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

    Class.findAll(filterExpression, expressionAttibuteValues, data.lastStartKey, 20, function(err, classList) {
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

  let lastEvaluatedKey = data && data.lastStartKey ?  {classId: data.lastStartKey} : null;
  let isLastClass = false;

  Class.findAll(null, null, lastEvaluatedKey, 10, function(err, classList) {

    if (err) {
      callback(err, null);
      return;
    }
    if (classList.length < 10){
      isLastClass = true
    }
    response.statusCode = ServerConstant.API_CODE_OK;
    Utilities.bind({classList}, response);
    response.isLastClass = isLastClass;
    callback(null, response);
  })
};

function getResponse(expression, expressionValue, data, response, callback) {
  Class.findAll(expression, expressionValue, data.lastStartKey, 20, function(err, classList) {

    if (err) {
      callback(err, null);
      return;
    }
    response.statusCode = ServerConstant.API_CODE_OK;
    Utilities.bind({classList}, response);
    callback(null, response);
  })
}

module.exports.searchClassList = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;
  let response = new APIResponseClassListModel();
  let expression = null;
  let expressionValue = null;
  if (data) {
    let exp = [];
    expressionValue = {};
    for (var obj in data) {
      if (obj == 'keyword' && data[obj]){
        exp.push(`(contains(title, :className) or contains(category, :category) or contains(skill, :skill))`);
        expressionValue[':className'] = data[obj];
        expressionValue[':category'] = data[obj];
        expressionValue[':skill'] = data[obj];
      } else if (obj == 'filter' && data[obj]) {
        for (var key in data.filter) {
          if (data.filter[key] && key != "chargeType") {
            if (key == 'searchPrice') {
              exp.push(`fee <= :${key}`);
              expressionValue[":"+key] = data.filter[key];
            } else if (key == 'location') {
              let lat  = data.filter.location.lat;
              let lng = data.filter.location.lng;
              const latPerKm = 1 / 110.574;
              const lngPerKm = 1 / 111.320 * Math.cos(lat * Math.PI/180);

              const limitKm = 1;

              var sumLat = lat + limitKm * latPerKm;
              var sumLng = lng + limitKm * lngPerKm;

              var diffLat = lat - limitKm * latPerKm;
              var diffLng = lng - limitKm * lngPerKm;

              exp.push('(address.coordinate.lat BETWEEN :diffLat and :sumLat) and (address.coordinate.lng BETWEEN :diffLng and :sumLng)');
              expressionValue[":sumLat"] = sumLat;
              expressionValue[":sumLng"] = sumLng;
              expressionValue[":diffLat"] = diffLat;
              expressionValue[":diffLng"] = diffLng;
            } else {
              exp.push(`contains(${key}, :${key})`);
              expressionValue[":"+key] = data.filter[key];
            }
          }
        }
      } else if (obj == 'sort' && data[obj]) {
        expression = exp.join(' and ')

        if (exp.length === 0) {
          expression = null;
          expressionValue = null;
        }

        Class.findAllByOrder(expression, expressionValue, data.lastStartKey, 20, data.sort.sortType, data.sort.isAscending, function(err, classList) {

          if (err) {
            callback(err, null);
            return;
          }
          response.statusCode = ServerConstant.API_CODE_OK;
          Utilities.bind({classList}, response);
          callback(null, response);
          return;
        })
      }
    }

    if (!data.sort) {
      expression = exp.join(' and ')

      if (exp.length === 0) {
        expression = null;
        expressionValue = null;
      }
      getResponse(expression, expressionValue, data, response, callback)
    }
  } else {
    getResponse(expression, expressionValue, data, response, callback)
  }
};

module.exports.giveComment = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;
  let newComment = data.comment;
  const classId = event.path.id;
  let response = new APIResponseClassModel();

  // check userId valid
  if (!data.comment || !data.comment.content || !data.comment.rating) {
    response.statusCode = ServerConstant.API_CODE_ACC_INVALID_FIELDS;
    callback(null, response);
    return;
  }

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

module.exports.duplicateClass = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;
  const classId = event.path.id;

  let response = new APIResponseClassListModel();

  Class.findFirst('classId = :classId', {':classId' : classId}, function(err, classes) {

    if (err) {
      callback(err, null);
      return;
    }

    let duplicateClass = new Class();
    Utilities.bind(classes, duplicateClass)
    duplicateClass.createdAt = Utilities.getCurrentTime();
    duplicateClass.classId = uuidv4();
    duplicateClass.title = classes.title + ' (1)';
    duplicateClass.numberOfStudent = 0;
    duplicateClass.studentInfo = [];

    duplicateClass.saveOrUpdate(function(err, res) {
      if (err) {
        callback(err, null);
        return;
      }
      console.log('duplicateClass', duplicateClass)
      response.statusCode = ServerConstant.API_CODE_OK;
      Utilities.bind(duplicateClass, response);
      callback(null, response);
    })
  })
};
