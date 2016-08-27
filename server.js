var express = require('express');
var app = express();
var server = require('http').Server(app);

const port = 3002
const VALIDATION_TOKEN = 'remindr_bot_verify_token'

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

server.listen(port, function() {
	console.log('Server listening at localhost:' + port);
})