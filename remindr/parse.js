const request = require('request');
const Q = require('q');
const TOKEN = '6XM3ZT75UFHFTN4MTMEYA3TO3PBC7HJI';

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
				'Authorization': 'Bearer 6XM3ZT75UFHFTN4MTMEYA3TO3PBC7HJI',
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