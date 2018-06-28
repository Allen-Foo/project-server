'use strict';
const uuidv4 = require('uuid/v4');
const ServerConstant = require("../common/ServerConstant");
const User = require('../entity/User');
const Product = require('../entity/Product');
const CoinHistory = require('../entity/CoinHistory');
const TutorInformation = require('../entity/TutorInformation');
const ClassCashBook = require('../entity/ClassCashBook');
const APIResponseRevenueModel = require('../apiResponseModel/APIResponseRevenueModel');
const Utilities = require('../common/Utilities');

module.exports.getWalletRevenue = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  var response = new APIResponseRevenueModel();

  if (!data.userId) {
    response.statusCode = ServerConstant.API_CODE_INVALID_PARAMS;
    callback(null, response);
    return;
  }
  var currentDate = new Date(Utilities.getCurrentTime());
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
            if (classCashBookList[i].availableDate <= new Date(Utilities.getCurrentTime)) {
              for (var j in classCashBookList[i].paymentList) {
                  tutor.revenue += classCashBookList[i].paymentList[j].payment * (1-chargeFee);
                  classCashBookList[i].isOpen = false;
              }
            }
            else {
              for (var j in classCashBookList[i].paymentList) {
                  pendingRevenue += classCashBookList[i].paymentList[j].payment;
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
                Utilities.bind({tutor}, response);
                callback(null, response);
              })
              console.log('All records have been processed successfully');
            }
          });
        })
      })
    }
    else {
      TutorInformation.findFirst('userId = :userId', {':userId' : data.userId}, function(err, tutor) {
          response.statusCode = ServerConstant.API_CODE_OK;
          Utilities.bind({tutor}, response);
          callback(null, response);
      })
    }
  })
};
