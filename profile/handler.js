var AWS = require('aws-sdk');
const s3 = new AWS.S3();
var Utilities = require('../common/Utilities');
const ServerConstant = require("../common/ServerConstant");
const User = require('../entity/User');
const TutorInformation = require('../entity/TutorInformation');
const CompanyInformation = require('../entity/CompanyInformation');
const APIResponseUserModel = require('../apiResponseModel/APIResponseUserModel');

module.exports.updateProfile = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;

	var response = new APIResponseUserModel();
  // update dynamoDb
  User.findFirst('awsId = :awsId', {':awsId' : data.awsId}, function(err, user) {
    if (err || user == null) {
      callback(err, null);
      return;
    }
    console.log('data.user', data.user)

  	Utilities.bind(data.user, user);
  	// update profile

    user.saveOrUpdate(function(err, user) {
      if (err) {
        callback(err, null);
        return;
      }

      if (user.userRole == 'learner') {
        // Learner, Done
        response.statusCode = ServerConstant.API_CODE_OK;
        Utilities.bind(user, response);
        callback(null, response);
      }
      else if (user.userRole == 'tutor') {
        // Tutor, need to update tutorInformation
        TutorInformation.findFirst('userId = :userId', {':userId' : user.userId}, function(err, tutor) {
          if (err || tutor == null) {
            callback(err, null);
            return;
          }
          Utilities.bind(data.user, tutor);
          tutor.saveOrUpdate(function(err, tutor) {
            if (err) {
              callback(err, null);
              return;
            }
            // Done
            response.statusCode = ServerConstant.API_CODE_OK;
            Utilities.bind(user, response);
            callback(null, response);
          });

        });
      }
      else if (user.userRole == 'company') {
        // Company, need to update companyInformation
        CompanyInformation.findFirst('userId = :userId', {':userId' : user.userId}, function(err, company) {
          if (err || company == null) {
            callback(err, null);
            return;
          }
          Utilities.bind(data.user, company);
          company.saveOrUpdate(function(err, company) {
            if (err) {
              callback(err, null);
              return;
            }
            // Done
            response.statusCode = ServerConstant.API_CODE_OK;
            Utilities.bind(user, response);
            callback(null, response);
          });

        });
      }

    });
	})
};