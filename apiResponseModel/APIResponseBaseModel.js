const ServerConstant = require("../common/ServerConstant");

class APIResponseBaseModel {
    constructor() {
      this.statusCode = ServerConstant.API_CODE_OK;
      this.userId = '';
      this.maintenanceSchedule = '';
    }

}

module.exports = APIResponseBaseModel;
