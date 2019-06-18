var HackerFlights = require('./api/hackerFlights.js'),
	PublicAPIs = require('./api/publicAPI'),
	utils = require('./utils/utils.js'),
	socket = require('socket.io'),
	airportLocation;
		
exports.hackathonsListResponseHandler = function(airportLocation, socket){
	var location = airportLocation.split(', ');
	var city = location[0].toLowerCase();
	if(location.length != 2)
	{
		var state = location[0].toLowerCase();
	}
	else{
		var state = location[1].toLowerCase();
	}
	console.log('Departing from : ' + city + ', ' + state + ' ~ working on request . . .');
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
			HackerFlights.listHackerFlights(city, state, socket);		
		}
	});
}

exports.listAutocompletePlaces = function(input, sessionToken, socket) {
	PublicAPIs.listAutocompletePlaces(input, sessionToken, (err, places) => {
		//emit places
		if (err) {
			socket.emit('hackerFlights.placesAutoComplete', {
				message: JSON.stringify(err),
				status: 500,
				places: [],
			});
		} else {
			socket.emit('hackerFlights.placesAutoComplete', {
				message: null,
				status: 200,
				places,
			});
		}
	})
}

exports.getChipestPrice = (origin, destination, departureDate, returnDate, socket) => {
	PublicAPIs.getCheapestPrice(origin, destination, departureDate, returnDate, (err, { price, detailLink }) => {
		socket.emit('hackerFlights.getCheapestPrice', {
			message: null,
			status: 200,
			price,
			detailLink
		});
	});
}
