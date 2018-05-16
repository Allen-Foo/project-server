const serverless = require('serverless-http');
const express = require('express')
const app = express()
const paypal = require('paypal-rest-sdk')
const bodyParser = require('body-parser');


// configure paypal with the credentials you got when you created your paypal app
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AQHcaqHpkObVVAm5zeh9v8m2oDKVCoBFZ8vctdAoFw3yS-NFiAYr0Dxg8vjjmmY2OEfYhaK37zriA-8X', //  your client id
    'client_secret': 'EHn4CKfEfBmTU776uOFzrM8wHdF6laJ-Mrk0p4QZ6UOd7NhuS6ueYiJlVndv85MRopaiQ8LBoaMzFL22' // your client secret
  });

app.use(bodyParser.json({ strict: false }));

app.post('/buy' , function ( req , res ) {

	if(typeof req.body.name != "string" ||
			typeof req.body.curr != "string" ||
			typeof req.body.desc != "string" ||
			!Number.isInteger(req.body.sku) ||
			!Number.isInteger(req.body.quan) ||
			!isFinite(req.body.price))
			return res.send({"status":"-1001", "msg":"parameter is missing/incorrect"});

	// create payment object
    var payment = {
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
    createPay( payment )
        .then( ( transaction ) => {
            var id = transaction.id;
            var links = transaction.links;
            var counter = links.length;
            while( counter -- ) {
                if ( links[counter].method == 'REDIRECT') {
                    return res.send( {"status":1,"redirect_url":links[counter].href,"msg":"redirect to paypal"});
                }
            }
        })
        .catch( ( err ) => {
            console.log( err );
            res.send({"status":-1,"msg":err});
        });
});

// success
app.get('/success' , (req ,res ) => {
    // console.log(req.query);

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
    .then((payment)=>{
        res.send({"status":1,"msg":"payment success","data":payment});
    }).catch( ( err ) => {
        // console.log( err );
        res.send({"status":-1,"msg":err});
    });

})

// error
app.get('/err' , (req , res) => {
    res.send({"status":-1, "msg":req.query});
})

// helper functions
var createPay = ( payment ) => {
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

var executePay = (paymentID, paymentJson) => {
    return new Promise( (resolve, reject) => {
        paypal.payment.execute(paymentID, paymentJson, function (error, payment){
            if(error){
                reject(error.response);
            }else{
                resolve(payment);
            }
        });
    });
};

module.exports.handler = serverless(app);
