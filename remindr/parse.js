const request = require('request');
const Q = require('q');
var config = require('./config')

const TOKEN = config.wit_token;

module.exports = {

	getMessageVars : function(msg) {
		return this.witRequest(msg).then((res) => {
			console.log(res)
			return JSON.parse(res)
		})
	},

	witRequest : function(msg) {
		var deferred = Q.defer();
		var options = {
			url: 'https://api.wit.ai/message',
			method: 'GET',
			headers: { 
				'Authorization': 'Bearer ' + config.wit_token,
				'Content-Type': 'application/json'
			},
			qs: {
				'q': msg,
			}
		}
		request(options, function(err, res, body) {
			if(err) {
				deferred.reject(err)
			} else {
				deferred.resolve(body)
			}
		})
		return deferred.promise;
	}

}