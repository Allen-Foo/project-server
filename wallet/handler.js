'use strict';
const uuidv4 = require('uuid/v4');
const ServerConstant = require("../common/ServerConstant");
const User = require('../entity/User');
const Withdrawn = require('../entity/Withdrawn');
const Refund = require('../entity/Refund');
const Product = require('../entity/Product');
const CoinHistory = require('../entity/CoinHistory');
const TutorInformation = require('../entity/TutorInformation');
const ClassCashBook = require('../entity/ClassCashBook');
const ApplyClass = require('../entity/ApplyClass');
const Transaction = require('../entity/Transaction');
const Class = require('../entity/Class');
const APIResponseRevenueModel = require('../apiResponseModel/APIResponseRevenueModel');
const APIResponseWithdrawnListModel = require('../apiResponseModel/APIResponseWithdrawnListModel');
const APIResponseApplyWithdrawnModel = require('../apiResponseModel/APIResponseApplyWithdrawnModel');
const APIResponseApproveWithdrawnModel = require('../apiResponseModel/APIResponseApproveWithdrawnModel');
const APIResponseRefundListModel = require('../apiResponseModel/APIResponseRefundListModel');
const APIResponseApplyRefundModel = require('../apiResponseModel/APIResponseApplyRefundModel');
const APIResponseApproveRefundModel = require('../apiResponseModel/APIResponseApproveRefundModel');
const APIResponsePaypalReportModel = require('../apiResponseModel/APIResponsePaypalReportModel');
const APIResponseWithdrawnReportModel = require('../apiResponseModel/APIResponseWithdrawnReportModel');
const APIResponseRefundReportModel = require('../apiResponseModel/APIResponseRefundReportModel');
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
          for (var i in classCashBookList) {
            // Add Revenue
            if (classCashBookList[i].availableDate <= currentDate) {
              for (var j in classCashBookList[i].paymentList) {
                  if (paymentList[j].status == 'applied') {
                    tutor.revenue += classCashBookList[i].paymentList[j].payment;
                  }
                  else {
                    tutor.revenue += classCashBookList[i].paymentList[j].payment - classCashBookList[i].paymentList[j].refundAmount;
                  }
              }
              classCashBookList[i].isOpen = false;
            }
            else {
              for (var j in classCashBookList[i].paymentList) {
                  if (paymentList[j].status == 'applied') {
                    pendingRevenue += classCashBookList[i].paymentList[j].payment;
                  }
                  else {
                    pendingRevenue += classCashBookList[i].paymentList[j].payment - classCashBookList[i].paymentList[j].refundAmount;
                  }
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

  if (!data.userId || !data.bankAccount || !data.bankName || !data.bankAccountName || !data.amount || isNaN(data.amount) || data.amount <= 0) {
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
          var adminFeeRate = 0.1;
          if (tutor.revenue - data.amount > 0) {
            adminFeeRate = 0.1;
          }
          else if (tutor.revenue - data.amount > 100) {
            //TODO
          }
          tutor.revenue -= data.amount;
          tutor.saveOrUpdate(function(err,tutor){
            var withdrawn = new Withdrawn();
            withdrawn.withdrawnId = uuidv4();
            withdrawn.userId = data.userId;
            withdrawn.tutorName = user.name;
            withdrawn.bankName = data.bankName;
            withdrawn.bankAccount = data.bankAccount;
            withdrawn.bankAccountName = data.bankAccountName;
            withdrawn.requestAmount = data.amount;
            withdrawn.withdrawnAmount = data.amount * (1 - adminFeeRate);
            withdrawn.adminFeeRate = adminFeeRate;
            withdrawn.adminFee = data.amount * adminFeeRate;
            withdrawn.remainRevenue = tutor.revenue - data.amount;
            withdrawn.createdAt = Utilities.getCurrentTime();
            withdrawn.progress = 'processing';
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

  Withdrawn.findAll('progress = :progress', {':progress': 'processing'}, null, 999, function(err, withdrawnList) {

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
    withdrawn.progress = 'approved';
    withdrawn.saveOrUpdate(function(err,withdrawn){
      response.statusCode = ServerConstant.API_CODE_OK;
      callback(null, response);
    })
  })
};

module.exports.applyRefund = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  var response = new APIResponseApplyRefundModel();

  if (!data.userId || !data.applyId || !data.reason) {
    response.statusCode = ServerConstant.API_CODE_INVALID_PARAMS;
    callback(null, response);
    return;
  }
  User.findFirst ('userId = :userId', {':userId' : data.userId}, function(err, user) {
    if (err) {
      callback(err, null);
      return;
    }
    ApplyClass.findFirst ('applyId = :applyId', {':applyId' : data.applyId}, function(err, applyClass) {
      if (err) {
        callback(err, null);
        return;
      }
      Transaction.findFirst ('transactionId = :transactionId', {':transactionId' : applyClass.transactionId}, function(err, transaction) {
        if (err) {
          callback(err, null);
          return;
        }
        if (!transaction || applyClass.progress != 'applied') {
          response.statusCode = ServerConstant.API_CODE_CANNOT_REFUND;
          Utilities.bind(user, response);
          callback(null, response);
          return;
        }
        applyClass.progress = 'refunding';

        Class.findFirst('classId = :classId', {':classId' : applyClass.classId}, function(err, classes) {
          if (err) {
            callback(err, null);
            return;
          }
          let studentInfo =  classes.studentInfo || []
          studentInfo.forEach(function (element, index, array) {
              if (element.applyId == applyClass.applyId) {
                array[index].status = 'refunding';
              }
          })
          classes.numberOfStudent -= 1;
          classes.studentInfo = studentInfo;
          ClassCashBook.findFirst('classId = :classId', {':classId' : applyClass.classId}, function(err, classCashBook) {
            if (err) {
              callback(err, null);
              return;
            }
            var refundRate = 1;
            var adminFeeRate = 0.05;
            var tmpDateArray = Object.keys(classes.time);
            tmpDateArray.forEach(function(part, index, theArray) {
              theArray[index] = new Date (part)
            });
            var tmpDate = new Date(Math.min(...tmpDateArray));
            tmpDate.setDate (new Date(Date.now()).getDate() - tmpDate.getDate());
            if (tmpDate <= Utilities.THE_DAYS_CANNOT_REFUND) {
              response.statusCode = ServerConstant.API_CODE_CANNOT_REFUND;
              Utilities.bind(user, response);
              callback(null, response);
              return;
            }
            else if (tmpDate <= Utilities.THE_DAYS_CAN_REFUND_WITH_50_PERCENT_FEE) {
              refundRate = 0.5;
            }

            var refund = new Refund();
            refund.refundId = uuidv4();
            refund.name = user.name;
            refund.paypalAccount = transaction.payer.payer_info.email;
            refund.className = applyClass.className;
            refund.tutorName = applyClass.tutorName;
            refund.reason = data.reason;
            refund.refundRate = refundRate;
            refund.adminFeeRate = adminFeeRate;
            refund.adminFee = transaction.amount * adminFeeRate;
            refund.classFee = transaction.amount;
            refund.requestAmount = transaction.amount * refundRate;
            refund.refundAmount = transaction.amount * (refundRate - adminFeeRate);
            refund.createdAt = Utilities.getCurrentTime();
            refund.progress = 'processing';
            refund.transactionId = transaction.transactionId;

            let paymentList =  classCashBook.paymentList || []
            paymentList.forEach(function (element, index, array) {
                if (element.transactionId == transaction.transactionId) {
                  array[index].status = 'refunding';
                  array[index].refundId = refund.refundId;
                  array[index].refundAmount = transaction.amount * refundRate;
                }
            })
            classCashBook.paymentList = paymentList;
            classCashBook.isDirty = true;

            applyClass.saveOrUpdate (function(err, applyClass) {
              if (err) {
                callback(err, null);
                return;
              }
              classes.saveOrUpdate (function(err, classes) {
                if (err) {
                  callback(err, null);
                  return;
                }
                classCashBook.saveOrUpdate (function(err, classCashBook) {
                  if (err) {
                    callback(err, null);
                    return;
                  }
                  refund.saveOrUpdate(function(err, refund) {
                    if (err) {
                      callback(err, null);
                      return;
                    }
                    response.statusCode = ServerConstant.API_CODE_OK;
                    Utilities.bind(user, response);
                    callback(null, response);
                  })
                })
              })
            })
          })
        })
      })
    });
  });
};

module.exports.getRefundList = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  var response = new APIResponseRefundListModel();

  Refund.findAll('progress = :progress', {':progress': 'processing'}, null, 999, function(err, refundList) {

    if (err) {
      callback(err, null);
      return;
    }
    response.statusCode = ServerConstant.API_CODE_OK;
    Utilities.bind({refundList}, response);
    callback(null, response);
  })
};

module.exports.approveRefund = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  var response = new APIResponseApproveRefundModel();

  Refund.findFirst('refundId = :refundId', {':refundId' : data.refundId}, function(err, refund) {

    if (err) {
      callback(err, null);
      return;
    }
    refund.progress = 'approved';
    refund.saveOrUpdate(function(err,withdrawn){
      response.statusCode = ServerConstant.API_CODE_OK;
      callback(null, response);
    })
  })
};

module.exports.getPaypalReport = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  var response = new APIResponsePaypalReportModel();

  Transaction.findAll('type = :type', {':type' : 'class'}, null, 999, function(err, paypalList) {

    if (err) {
      callback(err, null);
      return;
    }
    response.statusCode = ServerConstant.API_CODE_OK;
    Utilities.bind({paypalList}, response);
    callback(null, response);
  })
};

module.exports.getWithdrawnReport = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  var response = new APIResponseWithdrawnReportModel();

  Withdrawn.findAll(null, null, null, 999, function(err, withdrawnList) {

    if (err) {
      callback(err, null);
      return;
    }
    response.statusCode = ServerConstant.API_CODE_OK;
    Utilities.bind({withdrawnList}, response);
    callback(null, response);
  })
};

module.exports.getRefundReport = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  var response = new APIResponseRefundReportModel();

  Refund.findAll(null, null, null, 999, function(err, refundList) {

    if (err) {
      callback(err, null);
      return;
    }
    response.statusCode = ServerConstant.API_CODE_OK;
    Utilities.bind({refundList}, response);
    callback(null, response);
  })
};
