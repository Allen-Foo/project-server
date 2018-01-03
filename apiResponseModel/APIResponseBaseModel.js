const ServerConstant = require("../common/ServerConstant");

class APIResponseBaseModel {
  constructor() {
    this.statusCode = ServerConstant.API_CODE_OK;
    this.userId = '';
    this.maintenanceSchedule = '';
  }

  toResponseFomat() {
    var responseBody = {};
    for (var i in this) {
      if (i != 'statusCode')
        responseBody[i] = this[i];
    }
    var response = {
      statusCode: this.statusCode,
      body: JSON.stringify(responseBody)
    }

    return response;
  }
}

module.exports = APIResponseBaseModel;