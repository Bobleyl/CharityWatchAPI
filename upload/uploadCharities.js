'use strict';
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient({ region:'us-east-1' });

const fs = require('fs');

let rawdata = fs.readFileSync('charities.json');
let data = JSON.parse(rawdata);
var i = 0;
for(var item in data) {
  i = i + 1
  const params = {
    TableName: "charity",
    Item: {
      uid: i.toString(),
      charity: data[item].Charity,
      effectiveness: data[item].Effectiveness,
      grade: data[item].CharityWatchGrade,
      category: data[item].Category,
      url: data[item].url
    },
  };
  console.log(params);
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the todo item.',
      });
      console.log("Created Item: " + item.charity.toString());
    }
  });
}