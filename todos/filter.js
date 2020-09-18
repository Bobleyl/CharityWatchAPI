'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.filter = (event, context, callback) => {
  const data = JSON.parse(event.body);

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    FilterExpression: "#category = :cat_val",
    ExpressionAttributeNames: {
      "#category": "category"
    },
    ExpressionAttributeValues: {
      ":cat_val": data.category,
    }
  };

  dynamoDb.scan(params, onScan)
  var count = 0
  var results = []
  function onScan(err, data) {
      if (err) {
          console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2))
          callback(null, {
            statusCode: error.statusCode || 501,
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify(results),
          });
          return;
      } else {
          console.log("Scan succeeded.");
          data.Items.forEach(function(itemdata) {
             console.log("Item :", ++count,JSON.stringify(itemdata))
             results.push(itemdata)
             console.log("Results: " + results.toString())
          });

          // continue scanning if we have more items
          if (typeof data.LastEvaluatedKey != "undefined") {
              console.log("Scanning for more...")
              params.ExclusiveStartKey = data.LastEvaluatedKey
              dynamoDb.scan(params, onScan)
          }else{
            console.log("Query succeeded.");
            const response = {
              statusCode: 200,
              body: JSON.stringify(results),
            };
            callback(null, response);
          }
      }
  }
};
