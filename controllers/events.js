var HackerFlights = require('./api/hackerFlights.js'),
		utils = require('./utils/utils.js'),
		socket = require('socket.io'),
		airportLocation;
		
exports.hackathonsListResponseHandler = function(airportLocation, socket){
	console.log('Departing from : ' + airportLocation + '~ working on request . . .');
	utils.locationExists(airportLocation, function(error, data){
		if(!data)
		{
			socket.emit('hackerFlights.hackathon', {
				hackathon : null,
				status : 500,
				message : 'Invalid airport location'
			});
		}
		else
		{
			HackerFlights.findFlights(data.code, socket);		
		}
	});
}