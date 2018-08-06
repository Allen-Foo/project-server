'use strict';
const uuidv4 = require('uuid/v4');
const ServerConstant = require("../common/ServerConstant");
const Advertisement = require('../entity/Advertisement');
const Setting = require('../entity/Setting');
const APIResponseAdvertisementModel = require('../apiResponseModel/APIResponseAdvertisementModel');
const Utilities = require('../common/Utilities');

module.exports.getAdvertisement = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  var response = new APIResponseAdvertisementModel();

  Advertisement.findFirst(null, null, function(err, advertisement) {

    if (err) {
      callback(err, null);
      return;
    }
    if (advertisement) {
      Utilities.bind(advertisement, response);
    }
    Setting.findFirst(null, null, function(err, setting) {

      if (err) {
        callback(err, null);
        return;
      }
      response.statusCode = ServerConstant.API_CODE_OK;
      if (setting) {
        response.version = setting.version;
      }
      callback(null, response);
    })
  })
};

module.exports.updateAdvertisement = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  var response = new APIResponseAdvertisementModel();

  Advertisement.findFirst(null, null, function(err, advertisement) {

    if (err) {
      callback(err, null);
      return;
    }
    if (data.file == 'null') {
      if (!advertisement) {
        advertisement = new Advertisement();
        advertisement.advertisementId = uuidv4();
      }
      advertisement.url = data.url;
      advertisement.createdAt = Utilities.getCurrentTime();
      advertisement.startedAt = data.startedAt;
      advertisement.finishedAt = data.finishedAt;
      advertisement.saveOrUpdate(function(err, advertisement) {
        response.statusCode = ServerConstant.API_CODE_OK;
        Utilities.bind(advertisement, response);
        callback(null, response);
        return;
      })
    }
    else {
      Utilities.uploadFile('aws-test-dev-uploads', data.key, data.file, (err, result) => {
        if (err) {
          callback(err, null);
          return;
        }
        if (!advertisement) {
          advertisement = new Advertisement();
          advertisement.advertisementId = uuidv4();
        }
        advertisement.imgUrl = result.Location;
        advertisement.url = data.url;
        advertisement.createdAt = Utilities.getCurrentTime();
        advertisement.startedAt = data.startedAt;
        advertisement.finishedAt = data.finishedAt;

        advertisement.saveOrUpdate(function(err, advertisement) {
          response.statusCode = ServerConstant.API_CODE_OK;
          Utilities.bind(advertisement, response);
          callback(null, response);
        })
      })
    }
  })
};
