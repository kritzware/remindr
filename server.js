var express = require('express');
var app = express();
var server = require('http').Server(app);
var request = require('request')

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

app.post('/webhook', function (req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
        	console.log(event.message)
            sendMessage(event.sender.id, {text: "Echo: " + event.message.text});
        }
    }
    res.sendStatus(200);
});

function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

server.listen(port, function() {
	console.log('Server listening at localhost:' + port);
})
