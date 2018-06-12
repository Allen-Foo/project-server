'use strict';
const uuidv4 = require('uuid/v4');
const ServerConstant = require("../common/ServerConstant");
const Product = require('../entity/Product');
const APIResponseProductListModel = require('../apiResponseModel/APIResponseProductListModel');
const APIResponsepPurchaseGoldModel = require('../apiResponseModel/APIResponsepPurchaseGoldModel');
const Utilities = require('../common/Utilities');

module.exports.getProductList = (event, context, callback) => {
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
            response.statusCode = ServerConstant.API_CODE_OK;
            Utilities.bind(data, response);
            callback(null, response);
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
