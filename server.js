var express = require('express');
var app = express();
var server = require('http').Server(app);
var request = require('request')
var crypto = require('crypto')
var bodyParser = require('body-parser')
var _ = require('lodash')
var moment = require('moment')
var config = require('config')

const wit = require('./remindr/parse.js')

const APP_SECRET = config.fb_app_secret

app.use(bodyParser.json({ verify: verifyRequestSignature }));

function verifyRequestSignature(req, res, buf) {
  var signature = req.headers["x-hub-signature"];

  if (!signature) {
    // For testing, let's log an error. In production, you should throw an 
    // error.
    console.error("Couldn't validate the signature.");
  } else {
    var elements = signature.split('=');
    var method = elements[0];
    var signatureHash = elements[1];

    var expectedHash = crypto.createHmac('sha1', APP_SECRET)
                        .update(buf)
                        .digest('hex');

    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.");
    }
  }
}

const port = 3002
const VALIDATION_TOKEN = 'remindr_bot_verify_token'
const ACCESS_TOKEN = config.fb_access_token

app.get('/', (req, res) => {
	// res.sendFile(__dirname + '/public/index.html');
	res.json({Messenger: 'https://m.me/636057863237977'})
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

        // if(_.includes(event.message, 'thanks') || _.includes(event.message, 'Thanks') ||)

        if (event.message && event.message.text) {
        	console.log(event.message)
        	// sendMessage(event.sender.id, {text: "Echo: " + event.message.
		wit.getMessageVars(event.message.text).then((vars) => {
			console.log('wit here')
			var msg = vars.entities.reminder[0].value
			var time = moment(vars.entities.datetime[0].value).format('YYYY-MM-DD dddd HH:mm:ss')
			console.log(vars)
			console.log(msg)
			sendMessage(event.sender.id, {text: msg + ' : ' + time})
		})

		// wit.getMessageVars(event.message).then((vars) => {
        	// 	console.log(vars)

        	// 	var msg = vars.entities.reminder[0].value
        	// 	var time = moment(vars.entities.datetime[0].value).format('YYYY-MM-DD dddd HH:mm:ss')
        	// 	sendMessage(event.sender.id, {text: msg + ' : ' + time});
        	// })
        }
    }
    res.sendStatus(200);
});

function sendMessage(recipientId, message) {
	
	console.log('sendMessage')
	console.log(message)

    request({
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {access_token: ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: {id: recipientId},
            message: message,
            // message: {
            // 	attachment: {
            // 		type: 'image',
            // 		payload: {
            // 			url: 'https://media.giphy.com/media/3ornk57KwDXf81rjWM/giphy.gif'
            // 		}
            // 	}
            // }
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
