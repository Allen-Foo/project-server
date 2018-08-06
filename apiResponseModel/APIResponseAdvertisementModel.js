var APIResponseBaseModel = require("./APIResponseBaseModel");

class APIResponseAdvertisementModel extends APIResponseBaseModel {
    constructor(statusCode) {
      super();
      this.advertisementId = 'null';
      this.imgUrl = 'null';
      this.url = 'null';
      this.createdAt = 'null';
      this.startedAt = 'null';
      this.finishedAt = 'null';
      this.version = 'null';
    }
}

module.exports = APIResponseAdvertisementModel;
