
//Sample code for Service Bus Topics
//Update the connecting string for Service Bus on the config.js

var azure = require('azure');
var config=require('./config');
var topic = 'orders';
var subscription1 = 'supplier1';
var subscription2 = 'supplier2';

var serviceBusClient = azure.createServiceBusService(config.sbConnection);
function createTopic() {
    //Create topic.
    serviceBusClient.createTopicIfNotExists(topic, function (error) {
        if(!error) {
            {
                console.log('Subscriber ' + subscriber + ' registered for ' + topic + ' messages');
            }
        }
    });    
}

function sendMessage(message) {
    // Send messages for subscribers
    serviceBusClient.sendTopicMessage(topic, message, function(error) {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Message sent');
        }
    });
}

function receiveMessages(subscriber) {
    // Receive the messages for subscription.
    serviceBusClient.receiveSubscriptionMessage(topic, subscriber, function (error1, message1) {
        if (error1) {
            console.log(error1);
        } else {
            var topicMessage1 = JSON.parse(message1.body);
            console.log('Processing Order# ' + topicMessage1.OrderId
                + ' placed on ' + topicMessage1.OrderDate + ' from ' + subscriber);
            //call for next message
            serviceBusClient.receiveSubscriptionMessage(topic, subscriber, function (error2, message2) {
                if (error2) {
                    console.log(error2);
                } else {
                    var topicMessage2 = JSON.parse(message2.body);
                    console.log('Processing Order# ' + topicMessage2.OrderId
                        + ' placed on ' + topicMessage1.OrderDate + ' from ' + subscriber);
                }
            });
        }
    });
}


//step 1 - Create Topic
createTopic();
//step 2 - Create Subscriptions
createSubscription(subscription1);
createSubscription(subscription2);
//Step 3 - Send messages from Topics
var orderMessage1={"OrderId":101,"OrderDate": new Date().toDateString()};
sendMessage(JSON.stringify(orderMessage1));
var orderMessage2={"OrderId":102,"OrderDate": new Date().toDateString()};
sendMessage(JSON.stringify(orderMessage2));
//Step 4 - Receive messages from Subscribers.
receiveMessages(subscription1);
receiveMessages(subscription2);
