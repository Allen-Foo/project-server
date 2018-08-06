'use strict';
const uuidv4 = require('uuid/v4');
const ServerConstant = require("../common/ServerConstant");
const User = require('../entity/User');
const Cms = require('../entity/Cms');
const APIResponseProductListModel = require('../apiResponseModel/APIResponseProductListModel');
const APIResponsepPurchaseGoldModel = require('../apiResponseModel/APIResponsePurchaseGoldModel');
const APIResponseCoinHistoryListModel = require('../apiResponseModel/APIResponseCoinHistoryListModel');
const Utilities = require('../common/Utilities');
const webpush = require('web-push');

module.exports.pushWebNotification = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

  // VAPID keys should only be generated only once.
  webpush.setGCMAPIKey('AIzaSyBpOflXAYMg2ywCjWzNikubF2ovCvCXSbc');
  webpush.setVapidDetails(
    'mailto:example@yourdomain.org',
    'BOzTqjYamHf3Aqy0xhMMuGGPK6vhg3T0XpUW-Z9wqfncHu5NqOaTLquXC_2V86Fuc247hH_EgcPmz0lyo9ZxjxQ',
    'DpW3bkanrlU3IrrJoza8QMVTuW3Bx2_6wxFeFmphjVw'
  );

  // This is the same output of calling JSON.stringify on a PushSubscription
  Cms.findFirst (null, null, function(err, cms) {
    if (err) {
      callback(err, null);
      return;
    }
    const pushSubscription = cms.subscriptionId;
    webpush.sendNotification(pushSubscription, data.content);
    
    callback (null, {'statusCode' : 200});
  });

};

module.exports.updateWebSubscription= (event, context, callback) => {
  // get data from the body of event
  const data = event.body;
  Cms.findFirst (null, null, function(err, cms) {
    if (err) {
      callback(err, null);
      return;
    }
    cms.subscriptionId = JSON.parse(data.subscriptionJson);
    cms.saveOrUpdate(function(err, cms) {
      if (err) {
        callback(err, null);
        return;
      }
      callback (null, {'statusCode' : 200});
    });
  });
};
