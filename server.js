var express = require('express');
var app = express();
var server = require('http').Server(app);

const port = 3002

app.get('/', (req, res) => {
	res.json({Hello: 'world!'})
})

server.listen(port, function() {
	console.log('Server listening at localhost:' + port);
})