const uuidv4 = require('uuid/v4');
const ServerConstant = require("../common/ServerConstant");
const Class = require('../entity/Class');
const User = require('../entity/User');
const CompanyInformation = require('../entity/CompanyInformation');
const ApplyClass = require('../entity/ApplyClass')
const APIResponseUserModel = require('../apiResponseModel/APIResponseUserModel');
const APIResponseCompanyModel = require('../apiResponseModel/APIResponseCompanyModel');

const Utilities = require('../common/Utilities');

/**
 * @api {post} /getCompanyDetail Get Company List
 * @apiName getCompanyDetail
 * @apiGroup Company
 *
 * @apiParam {String} userId Users unique ID.
 *
 * @apiSuccess {Number} statusCode statusCode of response.
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *        "statusCode": 200,
 *        "profile": {}
 *        "selfIntro": ""
 *        "profession": ""
 *        "experience": ""
 *        "achievement": ""
 *     }
 *
 * @apiError NotAuthorizied The id of the tutor was not found.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Not Authorized
 *     {
 *       "error": "NotAuthorizied"
 *     }
 */
module.exports.getCompanyDetail = (event, context, callback) => {
  // get data from the body of event
  const data = event.body;
  let response = new APIResponseCompanyModel();

  if (!data.companyId) {
    response.statusCode = ServerConstant.API_CODE_INVALID_PARAMS;
    callback(null, response);
    return;
  }

  User.findFirst('userId = :userId', {':userId' : data.companyId}, function(err, company) {
    
    if (err) {
      callback(err, null);
      return;
    }
    let profile = {
      'userId' : company.userId,
      'address' : company.address,
      'website' : company.website,
      'introduction' : company.introduction,
      'name' : company.name,
      'username' : company.username,
      'phone' : company.phone,
      'skill' : company.skill,
      'avatarUrl' : company.avatarUrl,
      'totalRatings' : company.totalRatings,
      'userRole' : company.userRole,
    }

    response.profile = profile;

    CompanyInformation.findFirst('userId = :userId', {':userId' : data.companyId}, function(err, companyInfo) {

      if (err) {
        callback(err, null);
        return;
      }
      console.log('companyInfo', companyInfo)
      response.displayName = companyInfo.displayName;
      response.introduction = companyInfo.introduction;
      response.logo = companyInfo.logo;
      response.slogan = companyInfo.slogan;
      response.banner = companyInfo.banner;

      response.statusCode = ServerConstant.API_CODE_OK;

      callback(null, response);
    })
  })
};

