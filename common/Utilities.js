const ServerConstant = require("./ServerConstant");

Class DBUtilties() {
  static updateOrSaveDB(tableName, item) {
      var params = {
        Item: item
        TableName: tableName
      };

      docClient.put(params, function(err, data){
        if(err) {
          return ServerConstant.API_CODE_DB_ERROR;
        } else {
          return ServerConstant.API_CODE_OK;
        }
      });
    }

  static selectFromDB(tableName, query) {
    var params = {
      TableName: 'Table',
      IndexName: 'Index',
      KeyConditionExpression: 'HashKey = :hkey and RangeKey > :rkey',
      ExpressionAttributeValues: {
        ':hkey': 'key',
        ':rkey': 2015
      }
    };

    var documentClient = new AWS.DynamoDB.DocumentClient();

    documentClient.query(params, function(err, data) {
       if (err) console.log(err);
       else console.log(data);
    });

  }
}
