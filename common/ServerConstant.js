const ServerConstant = {

  API_CODE_OK: 200,

  // system error
  API_CODE_DB_ERROR: 100,
  API_CODE_DB_NOT_FOUND: 101,

  //comon error
  API_CODE_USER_NOT_FOUND: 201,
  API_CODE_TARGET_USER_NOT_FOUND: 202,
  API_CODE_INVALID_PARAMS: 203,

  //account error
  API_CODE_ACC_DUPLICATE_USERNAME: 300,
	API_CODE_ACC_DUPLICATE_EMAIL: 301,
	API_CODE_ACC_INVALID_FIELDS: 302,
	API_CODE_ACC_INCORRECT_PASSWORD: 303,
	API_CODE_ACC_ALREADY_LINKED_AWS_ID: 304,
	API_CODE_ACC_EMAIL_NOT_VERIFIED: 305,
	API_CODE_ACC_NOT_LINKED_AWS_ID: 306,
	API_CODE_ACC_INCORRECT_USERNAME: 307,

  API_CODE_ACC_UNAUTHORIZED: 401,

  // product error
  API_CODE_PRODUCT_NOT_FOUND: 501,

  // withdrawn error
  API_CODE_INSUFFICIENT_BALANCE: 601,

  // refund error
  API_CODE_CANNOT_REFUND: 651,

  // Common constant
  THE_DAYS_CAN_GET_THE_REVENUE: 7,
  THE_DAYS_CAN_REFUND_WITH_50_PERCENT_FEE: 7,
  THE_DAYS_CANNOT_REFUND: 1
}

module.exports = ServerConstant;
