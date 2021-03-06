const paypal = require('paypal-rest-sdk')
const applyClassHandler = require('../applyClass/handler')
const purchaseGoldHandler = require('../product/handler')
const uuidv4 = require('uuid/v4');
const ServerConstant = require("../common/ServerConstant");
const Transaction = require('../entity/Transaction');
const Utilities = require('../common/Utilities');
const Class = require('../entity/Class');

// configure paypal with the credentials you got when you created your paypal app
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AQHcaqHpkObVVAm5zeh9v8m2oDKVCoBFZ8vctdAoFw3yS-NFiAYr0Dxg8vjjmmY2OEfYhaK37zriA-8X', //  your client id
  'client_secret': 'EHn4CKfEfBmTU776uOFzrM8wHdF6laJ-Mrk0p4QZ6UOd7NhuS6ueYiJlVndv85MRopaiQ8LBoaMzFL22' // your client secret
});

module.exports.payment = (event, context, callback) => {

  let req = event;
  if (typeof req.body.name != "string" ||
      typeof req.body.curr != "string" ||
      typeof req.body.desc != "string" ||
      typeof req.body.sku != "string"  ||
      typeof req.body.type != "string" ||
      !Number.isInteger(req.body.quan) ||
      !isFinite(req.body.price)
    ) {
    let response = {"statusCode":-1001, "msg":"parameter is missing/incorrect"};
    callback(null, response);
    return
  }

  if (req.body.type === 'class') {
    Class.findFirst('classId = :classId', {':classId' : req.body.sku}, function(err, classes) {

      if (err) {
        callback(err, null);
        return;
      }

      let current = new Date();
      let hasPassed = false;
      Object.keys(classes.time).forEach(date => {
        let tempTime = new Date (classes.time[date][0].startTime)
        if (current - tempTime > 0) {
          hasPassed = true;
        }
      })

      if (hasPassed) {
        // Already passed
        let response = {"statusCode":-1002, "msg":"Application period has ended"};
        callback(null, response);
        return;
      }

      let customObj = {
        "userId": req.body.userId, // save the user id at custom field
        "productType": req.body.type,
      }

      let customJson = JSON.stringify(customObj);

      // create payment object
      let createPaymentJson = {
        "intent": "sale",
        "payer": {
          "payment_method": "paypal"
        },
        "redirect_urls": {
          "return_url": process.env.GW_URL + "/paymentSuccess?price="+req.body.price+"&curr="+req.body.curr,
          "cancel_url": process.env.GW_URL + "/paymentError"
        },
        "transactions": [{
          "item_list": {
            "items": [{
              "name": req.body.name,
              "sku": req.body.sku, //item no.
              "price": req.body.price,
              "currency": req.body.curr,
              "quantity": req.body.quan,
            }]
          },
          "amount": {
            "total": req.body.price,
            "currency": req.body.curr
          },
          "description": req.body.desc,
          "custom": customJson,
        }]
      }

      // call the create Pay method
      createPay(createPaymentJson)
        .then(( transaction) => {
          var id = transaction.id;
          var links = transaction.links;
          var counter = links.length;
          while( counter -- ) {
            if ( links[counter].method == 'REDIRECT') {
              let response = {"statusCode":200,"redirect_url":links[counter].href,"msg":"redirect to paypal"}
              callback(null, response);
              return
            }
          }
        })
        .catch((err) => {
          console.log( err );
          callback(err, null);
        });

    })
  }
  else {
    let customObj = {
      "userId": req.body.userId, // save the user id at custom field
      "productType": req.body.type,
    }

    let customJson = JSON.stringify(customObj);

    // create payment object
    let createPaymentJson = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": process.env.GW_URL + "/paymentSuccess?price="+req.body.price+"&curr="+req.body.curr,
        "cancel_url": process.env.GW_URL + "/paymentError"
      },
      "transactions": [{
        "item_list": {
          "items": [{
            "name": req.body.name,
            "sku": req.body.sku, //item no.
            "price": req.body.price,
            "currency": req.body.curr,
            "quantity": req.body.quan,
          }]
        },
        "amount": {
          "total": req.body.price,
          "currency": req.body.curr
        },
        "description": req.body.desc,
        "custom": customJson,
      }]
    }

    // call the create Pay method
    createPay(createPaymentJson)
      .then(( transaction) => {
        var id = transaction.id;
        var links = transaction.links;
        var counter = links.length;
        while( counter -- ) {
          if ( links[counter].method == 'REDIRECT') {
            let response = {"statusCode":200,"redirect_url":links[counter].href,"msg":"redirect to paypal"}
            callback(null, response);
            return
          }
        }
      })
      .catch((err) => {
        console.log( err );
        callback(err, null);
      });
  }

}

// success
module.exports.paymentSuccess = (event, context, callback) => {
  let req = event;

  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  const execute_payment_json = {
    "payer_id": payerId,
    "transactions" : [{
      "amount" : {
        "currency": req.query.curr,
        "total": req.query.price
      }
    }]
  };

  executePay(paymentId, execute_payment_json)
  .then((payment) => {
    let response = {"status":1,"msg":"payment success","data": "success"}

    let customObj = JSON.parse(payment.transactions[0].custom);
    // change the record of dynamoDB
    let sku = payment.transactions[0].item_list.items[0].sku
    let price = payment.transactions[0].item_list.items[0].price
    let userId = customObj.userId
    let productType = customObj.productType
    let paymentId = payment.id
    let paypalTransaction = payment.transactions
    let payer = payment.payer

    var transaction = new Transaction();
    transaction.transactionId = uuidv4();
    transaction.paymentId = paymentId;
    transaction.paypalTransaction = paypalTransaction;
    transaction.payer = payer;
    transaction.userId = userId;
    transaction.sku = sku;
    transaction.amount = price;
    transaction.paymentMethod = 'Paypal';
    transaction.createdAt = Utilities.getCurrentTime();
    transaction.productType = productType;
    transaction.saveOrUpdate(function (err, transaction) {
      if (err) {
        callback(err, null);
        return;
      }

      if (productType == 'class') {
        applyClassHandler.updateApplyClassTable(sku, userId, price, transaction.transactionId)
        .then ((status)=> {
          callback(null, response);
          return;
        })
        .catch( ( err ) => {
          callback(err, null);
        });
      }
      else if (productType == 'coin') {
        purchaseGoldHandler.updateProductTable(sku, userId, transactionId)
        .then ((status)=> {
          callback(null, response);
          return;
        })
        .catch( ( err ) => {
          callback(err, null);
        });
      }
    });
  }).catch( ( err ) => {
    // console.log( err );
    callback(err, null);
  });

}

// error
module.exports.paymentError = (event, context, callback) => {
  let response = {"status": -1, "msg": event.query}
  callback(null, response);
}

// helper functions
let createPay = (payment) => {
  return new Promise( ( resolve , reject ) => {
    paypal.payment.create( payment , function( err , payment ) {
      console.log(payment);
      if ( err ) {
        reject(err);
      }
      else {
        resolve(payment);
      }
    });
  });
};

let executePay = (paymentID, paymentJson) => {
  return new Promise( (resolve, reject) => {
    paypal.payment.execute(paymentID, paymentJson, function (error, payment) {
      if (error) {
        reject(error.response);
      } else {
        resolve(payment);
      }
    });
  });
};
