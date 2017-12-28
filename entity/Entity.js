const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
const ServerConstant = require("../common/ServerConstant");

class Entity {
  constructor(tableName) {
    this.tableName = tableName;
    Object.defineProperty(this, 'tableName', {enumerable: false});
  }

  // Return the first row from table
  static findFirst(filterExpression, expressionAttributeValues, callback) {
    var params = {
      TableName : new this().tableName,
      FilterExpression : filterExpression,
      ExpressionAttributeValues : expressionAttributeValues
    };

    documentClient.scan(params, function(err, data) {
      if(err) {
        console.log(err);
        callback(err, null);
      } else {
        var items = data.Items;
        var a = null;
        if (items.length != 0) {
          a = new this();
          Object.assign(a, items[0]);
        }
        callback(null, a);
      }
    }.bind(this));
  }

  // Return All row from table
  static findAll(filterExpression, expressionAttributeValues, callback) {
    var params = {
      TableName : new this().tableName,
      FilterExpression : filterExpression,
      ExpressionAttributeValues : expressionAttributeValues
    };
    documentClient.scan(params, function(err, data) {
      if(err) {
        console.log(err);
        callback(err, null);
      } else {
          var arr = [];
          var items = data.Items;
          for (var i in items) {
            var a = new this();
            Object.assign(a, items[i]);
            arr.push(a);
          }
          if (arr.length == 0) {
            arr = null
          }
        }
        callback(null, arr);
    }.bind(this));
  }

  // Add a row
  saveOrUpdate(callback) {
    // Add item
    var item = {};

    for (var index in this) {
      if (index == 'tableName')
      continue;

      item[index] = this[index];
    }
    var params = {
      TableName : this.tableName,
      Item: item
    };

    var documentClient = new AWS.DynamoDB.DocumentClient();

    documentClient.put(params, function(err, data) {
      if(err) {
        console.log(err);
        callback(err, null);
      } else {
        callback(null, this);
      }
    }.bind(this));
  }


}

module.exports = Entity;