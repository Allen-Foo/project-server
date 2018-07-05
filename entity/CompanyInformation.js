var Entity = require("./Entity");

class CompanyInformation extends Entity {
  constructor() {
    // Input tableName
    super('company_information', 'userId');
    // Create All table attribute
    this.displayName = '',
    this.introduction = '',
    this.logo = '',
    this.slogan = '',
    this.banner = [],
    this.userId = 'null';
    this.revenue = 0;
    this.pendingRevenue = 0;
  }
}

module.exports = CompanyInformation;
