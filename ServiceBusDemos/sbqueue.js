//Sample code for Service Bus Queues
//Update the connecting string for Service Bus on the config.js
var azure = require('azure');
var config=require('./config');
var queue = 'ordersqueue';

var serviceBusClient = azure.createServiceBusService(config.sbConnection);

function createQueue() {
serviceBusClient.createQueueIfNotExists(queue, function(error){
    if(error){
        console.log(error);
    }
    else
    {
        console.log('Queue ' + queue+ ' exists');
    }
});
}

function sendMessage(message) {
    serviceBusClient.sendQueueMessage(queue,message, function(error) {
        if (error) {
            console.log(error);
        }
        else
        {
            console.log('Message sent to queue');
        }
    });
}
function receiveMessages() {
    serviceBusClient.receiveQueueMessage(queue, function (error, message) {
        if (error) {
            console.log(error);
        } else {
            var message = JSON.parse(message.body);
            console.log('Processing Order# ' + message.OrderId
                + ' placed on ' + message.OrderDate);
        }
    });
}

//Step 1- Create the Queue
createQueue();
//Step 2 - Send the messages into Queue
var orderMessage={"OrderId":101,"OrderDate": new Date().toDateString()};
sendMessage(JSON.stringify(orderMessage));
//Step 3 - Receive messages from Queue
receiveMessages();//receive messages from queue