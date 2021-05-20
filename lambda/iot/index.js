console.log('Loading function');

const AWS = require('aws-sdk');
AWS.config.update({ region: process.env.region});

const dynamodb = new AWS.DynamoDB();
const sns = new AWS.SNS();

const WARN = -20; // warning threshold
const EMERG = -10; // emergency threshold

/*
{
"SensorID": 1,
"temperature": 20,
"humidity": 8,
"containerID": 123,
"containerName": "Smart container"
}
*/


exports.handler = function(event, context) {
  
  const date = new Date(Date.now()).toString();
  console.log(date);
    let temperature = 0;
    let humidity = 0;
    let containerID = 0;
    let sensorID = 0;
    let name = '';
  //const [record] = event.Records;
  try {
    /*
    const payload = Buffer.from(record.kinesis.data, 'base64').toString();
    const {SensorID, temperature, humidity, containerName} = JSON.parse(payload);
    // save records to the dynamodb
    
    await dynamodb.putItem({
      TableName: process.env.sensorReadingTable,
      Item: {
        sensorID: { N: String(SensorID) },
        temperature: { N: String(temperature) },
        humidity: { N: String(humidity) },
        containerName: { S: containerName }
      }
    }).promise();
  */
  
  console.log("Starting Function");
    event.Records.forEach(function(record) {
        // Kinesis data is base64 encoded so decode here
        var payload = Buffer.from(record.kinesis.data, 'base64').toString('ascii');
        console.log('Decoded payload:', payload);
        
        const obj = JSON.parse(payload);
        temperature = obj.temperature;
        humidity = obj.humidity;
        containerID = obj.containerID;
        sensorID = obj.SensorID;
        name = obj.contianerName;
        
        console.log(temperature);
        console.log(humidity);
        
        temperature = JSON.stringify(temperature);
        humidity = JSON.stringify(humidity);
        sensorID = JSON.stringify(sensorID);
        containerID = JSON.stringify(containerID);
        name = JSON.stringify(name);
        console.log(sensorID)
       createSensorReading(sensorID, temperature, humidity, containerID, context);
        updateContainer(containerID, temperature, humidity, context);
        containerName(name, temperature, humidity);
    });
    
  

  /*
    if (temperature >= WARN) {
      console.log('Overheat!');
      // publish messages to special SNS topic
      await sns.publish({
        TopicArn: process.env.NOTIFICATIONS_TOPIC_ARN,
        Subject: temperature >= EMERG ? 'emergency' : 'warning',
        Message: `${humidity} coolant temperature is ${temperature}°C!`
      }).promise();
    }
    */
    
  } catch (err) {
    console.log(err);
  }
};


async function createSensorReading(sensorID, temperature, humidity, containerID, context){
      const ddb = new AWS.DynamoDB({ apiVersion: "2012-10-08"});
      const documentClient = new AWS.DynamoDB.DocumentClient({ region: process.env.region});
      console.log(sensorID)
    
      const params = {
        TableName: process.env.sensorReadingTable,
        Item: {
          id:context.awsRequestId,
          temperature:temperature,
          humidity:humidity,
          containerSensorReadingsId: containerID,
          sensorID: sensorID
          
        }
      }
    
      try {
        const data = await documentClient.put(params).promise();
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    
}


async function updateContainer(containerID, temp, humidity){
  var docClient = new AWS.DynamoDB.DocumentClient()
  var params = {
    TableName: process.env.containerTable,
    Key:{
        id:containerID
    },
    UpdateExpression: "set currentTemperature = :r, currentHumidity=:p",
    ExpressionAttributeValues:{
        ":r":temp,
        ":p":humidity
       
    },
    ReturnValues:"UPDATED_NEW"
};

console.log("Updating the item...");
docClient.update(params, function(err, data) {
    if (err) {
        console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
    }
});
}



async function tempAlert(temp, humidity, context){
      const ddb = new AWS.DynamoDB({ apiVersion: "2012-10-08"});
      const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-west-2"});
    
      const params = {
        TableName: process.env.containerTable,
        Item: {
          id:context.awsRequestId,
          currentTemperature:temp,
          currentHumidity:humidity,
          
        }
      }
    
      try {
        const data = await documentClient.put(params).promise();
        console.log(data);
      } catch (err) {
        console.log(err);
      }
}


async function containerName(name, temp, humidity){
  
  var docClient = new AWS.DynamoDB.DocumentClient();

  var containerID = 0;
  var params = {
    FilterExpression: "#nm = :catval", 
     ExpressionAttributeNames:{
        "#nm": "name"
    },
  ExpressionAttributeValues: {
   ":catval":name
  }, 
 
   
  
  TableName: process.env.containerTable
 };
 
 docClient.scan(params, onScan);

function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        // print all the movies
        console.log("Scan succeeded.");
        console.log(data)
        data.Items.forEach(function(item) {
           console.log(
                item);
                containerID = item.id;
        });
        updateContainer(containerID, temp, humidity);
        // continue scanning if we have more movies, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
    }
}

}


/*
console.log('Loading function');
const AWS = require('aws-sdk');

AWS.config.update({ region: "us-west-2"});

exports.handler = function(event, context) {
    //console.log(JSON.stringify(event, null, 2));
    const date = new Date(Date.now()).toString();
    console.log(date);
    let temp = 0;
    let humidity = 0;
    let name = 0;
    let number = 0;
    console.log("Starting Function");
    event.Records.forEach(function(record) {
        // Kinesis data is base64 encoded so decode here
        var payload = Buffer.from(record.kinesis.data, 'base64').toString('ascii');
        console.log('Decoded payload:', payload);
        
        const obj = JSON.parse(payload);
        temp = obj.temperature;
        humidity = obj.humidity;
        name = obj.name;
        number = obj.SensorID;
        
        console.log(temp);
        console.log(humidity);
        
        temp = JSON.stringify(temp);
        humidity = JSON.stringify(humidity);
        number = JSON.stringify(number);
        console.log(number)
       // createSensorReading(number,containerID, temp, humidity, context);
        //updateContainer(containerID, temp, humidity, context);
        containerName(name, temp, humidity);
    });
    
    
    
}

async function tempAlert(temp, humidity, context){
      const ddb = new AWS.DynamoDB({ apiVersion: "2012-10-08"});
      const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-west-2"});
    
      const params = {
        TableName: "Container-3oxc4xylxjethglg3zy3eexet4-dev",
        Item: {
          id:context.awsRequestId,
          currentTemperature:temp,
          currentHumidity:humidity,
          
        }
      }
    
      try {
        const data = await documentClient.put(params).promise();
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    
}

async function createSensorReading(number, containerID, temp, humidity, context){
      const ddb = new AWS.DynamoDB({ apiVersion: "2012-10-08"});
      const documentClient = new AWS.DynamoDB.DocumentClient({ region: "us-west-2"});
      console.log(number)
    
      const params = {
        TableName: "SensorReading-3oxc4xylxjethglg3zy3eexet4-dev",
        Item: {
          id:context.awsRequestId,
         temperature:temp,
          humidity:humidity,
          containerSensorReadingsId: containerID,
          
          sensorID: number
          
        }
      }
    
      try {
        const data = await documentClient.put(params).promise();
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    
}

async function updateContainer(containerID, temp, humidity){
  var docClient = new AWS.DynamoDB.DocumentClient()
  var params = {
    TableName: "Container-3oxc4xylxjethglg3zy3eexet4-dev",
    Key:{
        id:containerID
    },
    UpdateExpression: "set currentTemperature = :r, currentHumidity=:p",
    ExpressionAttributeValues:{
        ":r":temp,
        ":p":humidity
       
    },
    ReturnValues:"UPDATED_NEW"
};

console.log("Updating the item...");
docClient.update(params, function(err, data) {
    if (err) {
        console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
    }
});
}

async function containerName(name, temp, humidity){
  
  var docClient = new AWS.DynamoDB.DocumentClient();

  var containerID = 0;
  var params = {
    FilterExpression: "#nm = :catval", 
     ExpressionAttributeNames:{
        "#nm": "name"
    },
  ExpressionAttributeValues: {
   ":catval":name
  }, 
 
   
  
  TableName: "Container-3oxc4xylxjethglg3zy3eexet4-dev"
 };
 
 docClient.scan(params, onScan);

function onScan(err, data) {
    if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        // print all the movies
        console.log("Scan succeeded.");
        console.log(data)
        data.Items.forEach(function(item) {
           console.log(
                item);
                containerID = item.id;
        });
        updateContainer(containerID, temp, humidity);
        // continue scanning if we have more movies, because
        // scan can retrieve a maximum of 1MB of data
        if (typeof data.LastEvaluatedKey != "undefined") {
            console.log("Scanning for more...");
            params.ExclusiveStartKey = data.LastEvaluatedKey;
            docClient.scan(params, onScan);
        }
    }
}

}
*/