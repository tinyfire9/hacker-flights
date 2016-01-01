var HackerFlights = require('./api/hackerFlights.js'),
		utils = require('./utils/utils.js'),
		socket = require('socket.io'),
		airportLocation;
		
exports.hackathonsListResponseHandler = function(airportLocation, socket){
	console.log('Departing from : ' + airportLocation + '~ working on request . . .');
	var location = airportLocation.split(', ');
	var city = location[0].toLowerCase();
	if(location.length != 2)
	{
		var state = location[0].toLowerCase();
	}
	else{
		var state = location[1].toLowerCase();
	}
	utils.locationExists(city, state, function(status){
		if(!status)
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