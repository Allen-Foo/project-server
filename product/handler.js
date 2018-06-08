'use strict';
const uuidv4 = require('uuid/v4');
const ServerConstant = require("../common/ServerConstant");
const Product = require('../entity/Product');
const APIResponseUserModel = require('../apiResponseModel/APIResponseUserModel');
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
