import React from 'react';

import Paho from 'paho-mqtt';

 // Create a client instance
 client = new Paho.Client(mr2j0vvhki1l0v.messaging.solace.cloud, Number(20425), "103eoqfh0193edhoFSDH32");

 // set callback handlers
 client.onConnectionLost = onConnectionLost;
 client.onMessageArrived = onMessageArrived;

 // connect the client
 client.connect({onSuccess:onConnect});


 // called when the client connects
 function onConnect() {
   // Once a connection has been made, make a subscription and send a message.
   console.log("onConnect");
   client.subscribe("love-this-hackatho");
   message = new Paho.Message("Hello");
   message.destinationName = "World";
   client.send(message);
 }

 // called when the client loses its connection
 function onConnectionLost(responseObject) {
   if (responseObject.errorCode !== 0) {
     console.log("onConnectionLost:"+responseObject.errorMessage);
   }
 }

 // called when a message arrives
 function onMessageArrived(message) {
   console.log("onMessageArrived:"+message.payloadString);
 }

const getMessage = (message) => {
  client.on('messageReceived', (message) => {
    console.log(message.payloadString);
  });
}

export default getMessage;
