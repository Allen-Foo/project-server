'use strict';
const uuidv4 = require('uuid/v4');
const ServerConstant = require("../common/ServerConstant");
const Class = require('../entity/Class');
const User = require('../entity/User');
const ApplyClass = require('../entity/ApplyClass')
const APIResponseAppliedClassModel = require('../apiResponseModel/APIResponseAppliedClassModel');
const APIResponseAppliedClassListModel = require('../apiResponseModel/APIResponseAppliedClassListModel');
const Utilities = require('../common/Utilities');

module.exports.applyClass = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;
  const classId = event.path.id;

  let response = new APIResponseAppliedClassModel();

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
    //find tutor information
    User.findFirst('userId = :userId', {':userId' : classes.userId}, function(err, tutor) {
      if (err) {
        callback(err, null);
        return;
      }
      //find user information
      User.findFirst('userId = :userId', {':userId' : data.userId}, function(err, student) {
        if (err) {
          callback(err, null);
          return;
        }
        var newApplyClass = new ApplyClass();
        newApplyClass.applyId = uuidv4();
        newApplyClass.classId = classId;
        newApplyClass.className = classes.title;
        newApplyClass.registerAt = Utilities.getCurrentTime();
        newApplyClass.userId = data.userId;
        newApplyClass.userName = student.username;
        newApplyClass.tutorId = classes.userId;
        newApplyClass.tutorName = tutor.username;
        newApplyClass.photoList = classes.photoList;
        newApplyClass.address = classes.address;
        newApplyClass.time = classes.time;
        newApplyClass.title = classes.title;

        let studentInfo =  classes.studentInfo || []
        studentInfo.push({
          applyId: newApplyClass.applyId,
          userId: data.userId,
        });

        //newApplyClass.classTimeList =
        newApplyClass.saveOrUpdate(function(err, applyClass) {
          if (err) {
            callback(err, null);
            return;
          }

          classes.numberOfStudent += 1;
          classes.studentInfo = studentInfo;
          classes.user = tutor

          classes.saveOrUpdate(function(err, classes) {
            if (err) {
              callback(err, null);
              return;
            }
            response.statusCode = ServerConstant.API_CODE_OK;
            Utilities.bind(applyClass, response);
            callback(null, response);
          })
        });
      });
    })
  })
};

module.exports.updateApplyClassTable = (classId, userId, transactionId) => {
  return new Promise( ( resolve , reject ) => {
    Class.findFirst('classId = :classId', {':classId' : classId}, function(err, classes) {

      if (err) {
        reject(err);
      }
      //find tutor information
      User.findFirst('userId = :userId', {':userId' : classes.userId}, function(err, tutor) {
        if (err) {
          reject(err);
        }
        //find user information
        User.findFirst('userId = :userId', {':userId' : userId}, function(err, student) {
          if (err) {
            reject(err);
          }
          var newApplyClass = new ApplyClass();
          newApplyClass.applyId = uuidv4();
          newApplyClass.classId = classId;
          newApplyClass.className = classes.title;
          newApplyClass.registerAt = Utilities.getCurrentTime();
          newApplyClass.userId = userId;
          newApplyClass.userName = student.username;
          newApplyClass.tutorId = classes.userId;
          newApplyClass.tutorName = tutor.username;
          newApplyClass.photoList = classes.photoList;
          newApplyClass.address = classes.address;
          newApplyClass.time = classes.time;
          newApplyClass.title = classes.title;
          newApplyClass.transactionId = transactionId;

          let studentInfo =  classes.studentInfo || []
          studentInfo.push({
            applyId: newApplyClass.applyId,
            userId: userId,
          });

          //newApplyClass.classTimeList =
          newApplyClass.saveOrUpdate(function(err, applyClass) {
            if (err) {
              reject(err);
            }

            classes.numberOfStudent += 1;
            classes.studentInfo = studentInfo;
            classes.user = tutor

            classes.saveOrUpdate(function(err, classes) {
              if (err) {
                reject(err);
              }
              resolve('success')
            })
          });
        });
      })
    })
  })
}

module.exports.getAppliedClassList = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  let response = new APIResponseAppliedClassListModel();

  ApplyClass.findAll('userId = :userId', {':userId' : data.userId}, data.lastStartKey, 20, function(err, appliedClassList) {

    if (err) {
      callback(err, null);
      return;
    }
    response.statusCode = ServerConstant.API_CODE_OK;
    Utilities.bind({appliedClassList}, response);
    callback(null, response);
  })
};
