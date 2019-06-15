var utils = require('../utils/utils.js');
var PublicAPI = require('./publicAPI.js');
var models = require('../../models/models.js');
var queriesModel = models.queries;
var airportsModel = models.airports;

var HackerFlights = function(){}

HackerFlights.prototype.listHackerFlights = function(city, state, socket){
	PublicAPI.findNearestAirport(city, state, function(originError, nearestAirportsToOrigin){
		if(originError) {
			throw Error(originError);
		}

		if (nearestAirportsToOrigin.length > 0) {
			HackerFlights.prototype.findFlightsToAllHackathons(nearestAirportsToOrigin[0], (error, flightData) => {
				if (!flightData) {
					socket.emit('hackerFlights.hackathon', { 
						hackathon : null,
						status : 200,
						message : null 
					});
					return;
				}

				flightData.nearestAirportsToOrigin = nearestAirportsToOrigin;
				socket.emit('hackerFlights.hackathon', { 
					hackathon : flightData,
					status : 200,
					message : null 
				});
			});
		}
	});
}

HackerFlights.prototype.findFlightsToAllHackathons = (nearestAirportToOrigin, callback) => {
	PublicAPI.getHackathons(function(hackathons){
		if (hackathons.length === 0) {
			callback(null, null);
		}
		hackathons.forEach(function(hackathon, index){
			const location = utils.parseLocation(hackathon.city);
			const params = {
				hackathons,
				nearestAirportToOrigin,
				hackathon,
				location
			}
			HackerFlights.prototype.findHackerFlight(params, (err, flightData) => {
				callback(err, flightData);
			});
		});
	});
}

HackerFlights.prototype.findHackerFlight = (params, callback) => {
	const { hackathons, hackathon, nearestAirportToOrigin, location } = params;
	let startDate, endDate;
	PublicAPI.findNearestAirport(location.city, location.state, function(hackathonError, nearestAirportsToHackathon){
		if(hackathonError) {
			throw Error(hackathonError);
		}
		startDate = utils.formatDate(hackathon.startDate, hackathon.year);
		endDate = utils.formatDate(hackathon.endDate, hackathon.year);


		// startDate = '25/06/2019';
		// endDate = '28/06/2019';

		PublicAPI.getCheapestPrice(nearestAirportToOrigin.code, nearestAirportsToHackathon[0].code, startDate, endDate, function(error, priceData){
			const { price, detailLink } = priceData;
			if(error) {
				throw Error(error);
			}

			data = {
				hackathonName : hackathon.title,
				dates : [startDate, endDate],
				location : location.city + ', ' + location.state,
				originLocation: `${nearestAirportToOrigin.city}, ${nearestAirportToOrigin.state}`,
				originalLocationCode : nearestAirportToOrigin.code,
				airportLocations: nearestAirportsToHackathon.map((airport) => ({
					airportLocation: airport.city + ", " + airport.state,
					airportCode: airport.code,
				})),
				airportLocation: nearestAirportsToHackathon[0].city + ", " + nearestAirportsToHackathon[0].state,
				airportCode: nearestAirportsToHackathon[0].code,
				startingPrice : price,
				flightDetailLink: detailLink,
				numberOfHackathons : hackathons.length,
				url : hackathon.url
			};

			callback(null, data);
		});
	});
};

HackerFlights.prototype.tryNotifyingAPIUsage = function(){
	var APICalls = 0;
	var todaysDate = new Date().toDateString();
	queriesModel.find({date : todaysDate}, function(error, calls){
		try{
			for(var i = 0; i < calls.length; i++)
			{
				APICalls += calls[i].data.length;
			}
			if(APICalls >= 100)
			{
				utils.sendEmail('yohazel2@gmail.com', '<h1>hackerFlights</h1><br><p>Hey Yohannes, <br><br> Today, ' + todaysDate + ', <b>'
				 + APICalls + '</b> requests have been made to Google QPX-Express API. The estimated cost is <b>$ ' + APICalls*0.035 +
				 '</b>.</p><br>Thank you,<br>HackerFlights.tryNotifyingAPIUsage()');
			}
		}
		catch(error)
		{
			console.log(error);
		}
	});
}

module.exports = new HackerFlights();