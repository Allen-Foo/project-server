const paypal = require('paypal-rest-sdk')
// const applyClassHandler = require('../applyClass/handler')

// configure paypal with the credentials you got when you created your paypal app
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AQHcaqHpkObVVAm5zeh9v8m2oDKVCoBFZ8vctdAoFw3yS-NFiAYr0Dxg8vjjmmY2OEfYhaK37zriA-8X', //  your client id
  'client_secret': 'EHn4CKfEfBmTU776uOFzrM8wHdF6laJ-Mrk0p4QZ6UOd7NhuS6ueYiJlVndv85MRopaiQ8LBoaMzFL22' // your client secret
});

module.exports.buy = (event, context, callback) => {

  let req = event;
  if (typeof req.body.name != "string" ||
      typeof req.body.curr != "string" ||
      typeof req.body.desc != "string" ||
      !Number.isInteger(req.body.sku) ||
      !Number.isInteger(req.body.quan) ||
      !isFinite(req.body.price)
    ) {
    let response = {"status":"-1001", "msg":"parameter is missing/incorrect"};
    callback(null, response);
    return
  }

  // create payment object
  let createPaymentJson = {
    "intent": "sale",
    "payer": {
      "payment_method": "paypal"
    },
    "redirect_urls": {
      "return_url": "https://reaf1dgnga.execute-api.us-east-1.amazonaws.com/dev/success?price="+req.body.price+"&curr="+req.body.curr,
      "cancel_url": "https://reaf1dgnga.execute-api.us-east-1.amazonaws.com/dev/err"
    },
    "transactions": [{
      "item_list": {
        "items": [{
          "name": req.body.name,
          "sku": req.body.sku, //item no.
          "price": req.body.price,
          "currency": req.body.curr,
          "quantity": req.body.quan
        }]
      },
      "amount": {
        "total": req.body.price,
        "currency": req.body.curr
      },
      "description": req.body.desc
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
          let response = {"status":1,"redirect_url":links[counter].href,"msg":"redirect to paypal"}
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

// success
module.exports.success = (event, context, callback) => {
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

  // change the record of dynamoDB
  // applyClassHandler.updateApplyClassTable()

  executePay(paymentId, execute_payment_json)
  .then((payment) => {
    let response = {"status":1,"msg":"payment success","data":payment}
    callback(null, response);
    return
  }).catch( ( err ) => {
    // console.log( err );
    callback(err, null);
  });

}

// error
module.exports.err = (event, context, callback) => {
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
