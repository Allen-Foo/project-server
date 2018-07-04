'use strict';
const uuidv4 = require('uuid/v4');
const ServerConstant = require("../common/ServerConstant");
const User = require('../entity/User');
const Withdrawn = require('../entity/Withdrawn');
const Product = require('../entity/Product');
const CoinHistory = require('../entity/CoinHistory');
const TutorInformation = require('../entity/TutorInformation');
const ClassCashBook = require('../entity/ClassCashBook');
const APIResponseRevenueModel = require('../apiResponseModel/APIResponseRevenueModel');
const APIResponseWithdrawnListModel = require('../apiResponseModel/APIResponseWithdrawnListModel');
const APIResponseApplyWithdrawnModel = require('../apiResponseModel/APIResponseApplyWithdrawnModel');
const APIResponseApproveWithdrawnModel = require('../apiResponseModel/APIResponseApproveWithdrawnModel');
const Utilities = require('../common/Utilities');
const async = require("async");

module.exports.getWalletRevenue = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  var response = new APIResponseRevenueModel();

  if (!data.userId) {
    response.statusCode = ServerConstant.API_CODE_INVALID_PARAMS;
    callback(null, response);
    return;
  }
  var currentDate = Date.parse(new Date(Utilities.getCurrentTime()));
  // update revenue
  ClassCashBook.findFirst('userId = :userId and (isDirty = :isDirty or (availableDate <= :availableDate and isOpen = :isOpen))', {':userId' : data.userId, ':availableDate' : currentDate, ':isOpen' : true, ':isDirty' : true}, function(err, classCashBook) {
    if (err) {
      callback(err, null);
      return;
    }

    if (classCashBook) {
      ClassCashBook.findAll('userId = :userId and isOpen = :isOpen', {':userId' : data.userId, ':isOpen' : true}, null, 9999, function(err, classCashBookList) {
        if (err) {
          callback(err, null);
          return;
        }

        TutorInformation.findFirst('userId = :userId', {':userId' : data.userId}, function(err, tutor) {
          if (err) {
            callback(err, null);
            return;
          }

          var pendingRevenue = 0;
          var chargeFee = 0.05;
          for (var i in classCashBookList) {
            // Add Revenue
            if (classCashBookList[i].availableDate <= currentDate) {
              for (var j in classCashBookList[i].paymentList) {
                  tutor.revenue += classCashBookList[i].paymentList[j].payment * (1-chargeFee);
                  classCashBookList[i].isOpen = false;
              }
            }
            else {
              for (var j in classCashBookList[i].paymentList) {
                  pendingRevenue += classCashBookList[i].paymentList[j].payment * (1-chargeFee);
              }
            }
            classCashBookList[i].isDirty = false;
          }

          tutor.pendingRevenue = pendingRevenue;

          async.each(classCashBookList, function (item, callback) {
            item.saveOrUpdate(function (err, itemCallBack) {
              if (err) {
                callback(err);
              }
              else {
                callback();
              }
            })
          }, function (err) {
            if( err ) {
              console.log('A record failed to process');
            } else {
              tutor.saveOrUpdate(function (err, tutor) {
                response.statusCode = ServerConstant.API_CODE_OK;
                Utilities.bind(tutor, response);
                callback(null, response);
                return;
              })
              console.log('All records have been processed successfully');
            }
          });
        })
      })
    }
    else {
      TutorInformation.findFirst('userId = :userId', {':userId' : data.userId}, function(err, tutor) {
        if (err) {
          callback(err, null);
          return;
        }
          response.statusCode = ServerConstant.API_CODE_OK;
          Utilities.bind(tutor, response);
          callback(null, response);
          return;
      })
    }
  })
};

module.exports.applyWithdrawn = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  var response = new APIResponseApplyWithdrawnModel();

  if (!data.userId || !data.bankAccount || !data.bankName || !data.amount || isNaN(data.amount) || data.amount <= 0) {
    response.statusCode = ServerConstant.API_CODE_INVALID_PARAMS;
    callback(null, response);
    return;
  }
  User.findFirst ('userId = :userId', {':userId' : data.userId}, function(err, user) {
    if (err) {
      callback(err, null);
      return;
    }
    TutorInformation.findFirst('userId = :userId', {':userId' : data.userId}, function(err, tutor) {
      if (err) {
        callback(err, null);
        return;
      }
        if (tutor.revenue < data.amount) {
          response.statusCode = ServerConstant.API_CODE_INSUFFICIENT_BALANCE;
          callback(null, response);
        }
        else {
          tutor.revenue -= data.amount;
          tutor.saveOrUpdate(function(err,tutor){
            var withdrawn = new Withdrawn();
            withdrawn.withdrawnId = uuidv4();
            withdrawn.userId = data.userId;
            withdrawn.tutorName = user.name;
            withdrawn.bankName = data.bankName;
            withdrawn.bankAccount = data.bankAccount;
            withdrawn.amount = data.amount;
            withdrawn.createdAt = Utilities.getCurrentTime();
            withdrawn.isApproved = false;
            withdrawn.saveOrUpdate(function(err,tutor){
              response.statusCode = ServerConstant.API_CODE_OK;
              Utilities.bind(tutor, response);
              callback(null, response);
            });
          });
        }
    });
  });
};

module.exports.getWithdrawnList = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  var response = new APIResponseWithdrawnListModel();

  Withdrawn.findAll('isApproved = :isApproved', {':isApproved': false}, null, 999, function(err, withdrawnList) {

    if (err) {
      callback(err, null);
      return;
    }
    response.statusCode = ServerConstant.API_CODE_OK;
    Utilities.bind({withdrawnList}, response);
    callback(null, response);
  })
};

module.exports.approveWithdrawn = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  var response = new APIResponseApproveWithdrawnModel();

  Withdrawn.findFirst('withdrawnId = :withdrawnId', {':withdrawnId' : data.withdrawnId}, function(err, withdrawn) {

    if (err) {
      callback(err, null);
      return;
    }
    withdrawn.isApproved = true;
    withdrawn.saveOrUpdate(function(err,withdrawn){
      response.statusCode = ServerConstant.API_CODE_OK;
      callback(null, response);
    })
  })
};
