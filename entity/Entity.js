const AWS = require('aws-sdk');
const documentClient = new AWS.DynamoDB.DocumentClient({region: 'us-east-1'});
const ServerConstant = require("../common/ServerConstant");

class Entity {
  constructor(tableName, hashkey) {
    this.tableName = tableName;
    this.hashkey = hashkey;
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
          if (data.LastEvaluatedKey && data.Items.length == 0) {
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            this.keepFindFirst(params, callback);
          }
          else {
            var items = data.Items;
            var a = null;
            if (items.length != 0) {
              a = new this();
              Object.assign(a, items[0]);
            }
            callback(null, a);
        }
      }
    }.bind(this));
  }

// keep find first
  static keepFindFirst(params, callback) {
    documentClient.scan(params, function(err, data) {
      if(err) {
        console.log(err);
        callback(err, null);
      } else {
          if (data.LastEvaluatedKey && data.Items.length == 0) {
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            this.keepFindFirst(params, callback);
          }
          else {
            var items = data.Items;
            var a = null;
            if (items.length != 0) {
              a = new this();
              Object.assign(a, items[0]);
            }
            callback(null, a);
          }
      }
    }.bind(this));
  }

  // Return All row from table
  static findAll(filterExpression, expressionAttributeValues, numberOfResult, callback) {
    var params = {
      TableName : new this().tableName,
      FilterExpression : filterExpression,
      ExpressionAttributeValues : expressionAttributeValues
    };
    console.log(params);
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

          if (data.LastEvaluatedKey && arr.length < numberOfResult) {
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            this.keepFindAll(params, arr, numberOfResult, callback);
          }
          else {
            arr = arr.slice(0, numberOfResult);
            callback(null, arr);
          }
      }
    }.bind(this));
  }

  static keepFindAll(params, arr, numberOfResult, callback) {
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

          if (data.LastEvaluatedKey && arr.length < numberOfResult) {
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            this.keepFindAll(params, arr, numberOfResult, callback);
          }
          else {
            arr = arr.slice(0, numberOfResult);
            callback(null, arr);
          }
      }
    }.bind(this));
  }

  // Return All row from table by Order
  static findAllByOrder(filterExpression, expressionAttributeValues, numberOfResult, sortIndexName, isAscending, callback) {
    if (expressionAttributeValues == null) {
      expressionAttributeValues = [];
    }
    expressionAttributeValues[':hashkey'] = new this().hashkey;
    var keyConditionExpression = 'hashkey = :hashkey';
    if (filterExpression != null) {
      var tmp = filterExpression.split(' and ');
      var index = tmp.findIndex(x => x.includes(sortIndexName));
      if (index != -1) {
        keyConditionExpression += ' and ' + tmp[index];
        tmp.splice(index, 1);
        console.log('tmp', tmp);
        filterExpression = tmp.join(' and ');
        console.log('filterExpression', filterExpression);
      }
    }

    var params = {
      TableName: new this().tableName,
      IndexName: 'hashkey-' + sortIndexName + '-index',
      KeyConditionExpression: keyConditionExpression,
      FilterExpression: filterExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ScanIndexForward: isAscending,
    };
    console.log(params);
    documentClient.query(params, function(err, data) {
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

          if (data.LastEvaluatedKey && arr.length < numberOfResult) {
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            this.keepFindAllbyOrder(params, arr, numberOfResult, callback);
          }
          else {
            arr = arr.slice(0, numberOfResult);
            callback(null, arr);
          }
      }
    }.bind(this));
  }

  static keepFindAllbyOrder(params, arr, numberOfResult, callback) {
    documentClient.query(params, function(err, data) {
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

          if (data.LastEvaluatedKey && arr.length < numberOfResult) {
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            this.keepFindAll(params, arr, numberOfResult, callback);
          }
          else {
            arr = arr.slice(0, numberOfResult);
            callback(null, arr);
          }
      }
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

  delete(callback) {
    var params = {
      TableName : this.tableName,
      Key: {
        [this.hashkey]: this[this.hashkey],
      }
    };

    var documentClient = new AWS.DynamoDB.DocumentClient();

    documentClient.delete(params, function(err, data) {
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
