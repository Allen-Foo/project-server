'use strict';
const uuidv4 = require('uuid/v4');
const ServerConstant = require("../common/ServerConstant");
const User = require('../entity/User');
const Product = require('../entity/Product');
const CoinHistory = require('../entity/CoinHistory');
const APIResponseProductListModel = require('../apiResponseModel/APIResponseProductListModel');
const APIResponsepPurchaseGoldModel = require('../apiResponseModel/APIResponsePurchaseGoldModel');
const APIResponseCoinHistoryListModel = require('../apiResponseModel/APIResponseCoinHistoryListModel');
const Utilities = require('../common/Utilities');

module.exports.getWalletRevenue = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  var response = new APIResponseProductListModel();
  let lastEvaluatedKey = data && data.lastStartKey ?  {productId: data.lastStartKey} : null;
  let isLastProduct = false;

  Product.findAll(null, null, lastEvaluatedKey, 10, function(err, productList) {

    if (err) {
      callback(err, null);
      return;
    }
    if (productList.length < 10){
      isLastProduct = true
    }
    response.statusCode = ServerConstant.API_CODE_OK;
    Utilities.bind({productList}, response);
    response.isLastProduct = isLastProduct;
    callback(null, response);
  })
};

module.exports.purchaseGold = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  var response = new APIResponsepPurchaseGoldModel();

  if (!data.userId || !data.productId) {
    response.statusCode = ServerConstant.API_CODE_INVALID_PARAMS;
    callback(null, response);
    return;
  }

  Product.findFirst('productId = :productId', {':productId' : data.productId}, function(err, product) {
    if (err) {
      callback(err, null);
      return;
    }
  	if (product != null) {
      User.findFirst ('userId = :userId', {':userId' : data.userId}, function(err, user) {
        if (err) {
          callback(err, null);
          return;
        }
      	if (user != null) {
          user.gold += product.gold;
          user.saveOrUpdate(function (err, user) {
            if (err) {
              callback(err, null);
              return;
            }
            var coinHistory = new CoinHistory();
            coinHistory.userId = user.userId;
            coinHistory.coinHistoryId = uuidv4();
            coinHistory.createdAt = Utilities.getCurrentTime();
            coinHistory.gold = product.gold;
            coinHistory.enAction = 'Purchase Coins';
            coinHistory.tcAction = '金幣充值';
            coinHistory.scAction = '金币充值';
            coinHistory.saveOrUpdate(function (err, coinHistory) {
              if (err) {
                callback(err, null);
                return;
              }
              response.statusCode = ServerConstant.API_CODE_OK;
              response.user = user;
              callback(null, response);
            });
          });
        }
        else {
          response.statusCode = ServerConstant.API_CODE_USER_NOT_FOUND;
          callback(null, response);
          return;
        }
      });
    }
    else {
    	response.statusCode = ServerConstant.API_CODE_PRODUCT_NOT_FOUND;
    	callback(null, response);
      return;
  	}
  });

};

module.exports.getCoinHistoryList = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  var response = new APIResponseCoinHistoryListModel();

  if (!data.userId) {
    response.statusCode = ServerConstant.API_CODE_INVALID_PARAMS;
    callback(null, response);
    return;
  }

  let lastEvaluatedKey = data && data.lastStartKey ?  {productId: data.lastStartKey} : null;
  let isLastRecord = false;

  CoinHistory.findAll('userId = :userId', {':userId' : data.userId}, lastEvaluatedKey, 10, function(err, coinHistory) {

    if (err) {
      callback(err, null);
      return;
    }
    if (coinHistory.length < 10){
      isLastRecord = true
    }
    response.statusCode = ServerConstant.API_CODE_OK;
    Utilities.bind({coinHistory}, response);
    response.isLastRecord = isLastRecord;
    callback(null, response);
  })
};
