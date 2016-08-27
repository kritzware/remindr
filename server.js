var express = require('express');
var app = express();
var server = require('http').Server(app);

const port = 3002
const VALIDATION_TOKEN = 'remindr_bot_verify_token'
const ACCESS_TOKEN = 'EAAZALiJbpJY0BAM1cVeTCKZAL4ETYpjH8HHHYhhQuhVmaCaZCM4A3ECPOnd1p40O0aPLfXLpdMx5W2JbOOcJg3ZBHcQWBbbwqwuh0vJKxJ0293drl3uyJCswAoL7kPLSKiVMkyjGTJjjQHmjmScZBXkH1DZAH4MdMCybxOqR9R2wZDZD'

app.get('/', (req, res) => {
	res.json({Hello: 'world!'})
})

app.get('/webhook', (req, res) => {
	if(req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === VALIDATION_TOKEN) {
		console.log('validating webhook')
		res.status(200).send(req.query['hub.challenge'])
	} else {
	    console.error("Failed validation. Make sure the validation tokens match.");
	    res.sendStatus(403);  
	}
})

app.post('/webhook', function(req, res) {
	var data = req.body;
	if(data.object === 'page') {
		data.entry.forEach((pageEntry) => {
			if(messagingEvent.optin) {
          receivedAuthentication(messagingEvent);
        } else if (messagingEvent.message) {
          receivedMessage(messagingEvent);
        } else if (messagingEvent.delivery) {
          receivedDeliveryConfirmation(messagingEvent);
        } else if (messagingEvent.postback) {
          receivedPostback(messagingEvent);
        } else {
          console.log("Webhook received unknown messagingEvent: ", messagingEvent);
        }
			}		
		})
		res.sendStatus(200);	
	}
});

function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:", 
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;
	console.log(messageText
  // You may get a text or attachment but not both
  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {

    // If we receive a text message, check to see if it matches any special
    // keywords and send back the corresponding example. Otherwise, just echo
    // the text we received.
    switch (messageText) {
      case 'image':
        sendImageMessage(senderID);
        break;

      case 'button':
        sendButtonMessage(senderID);
        break;

      case 'generic':
        sendGenericMessage(senderID);
        break;

      case 'receipt':
        sendReceiptMessage(senderID);
        break;

      default:
        sendTextMessage(senderID, messageText);
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

server.listen(port, function() {
	console.log('Server listening at localhost:' + port);
})
