var utils = require('../utils/utils.js');
var PublicAPI = require('./publicAPI.js');
var models = require('../../models/models.js');
var queriesModel = models.queries;
var airportsModel = models.airports;

var HackerFlights = function(){}

HackerFlights.prototype.listHackerFlights = function(city, state, socket){
	PublicAPI.findNearestAirport(city, state, function(originError, nearestAirportToOrigin){
		if(originError) {
			throw Error(originError);
		}

		PublicAPI.getHackathons(function(hackathons){
			hackathons.forEach(function(hackathon, index){
				const location = utils.parseLocation(hackathon.city);
				const params = {
					hackathons,
					nearestAirportToOrigin,
					hackathon,
					location
				}
				HackerFlights.prototype.findHackerFlight(params, (err, flightData) => {
					socket.emit('hackerFlights.hackathon', { 
						hackathon : flightData,
						status : 200,
						message : null 
					});
				});
			});
		});
	});
}

HackerFlights.prototype.findHackerFlight = (params, callback) => {
	const { hackathons, hackathon, nearestAirportToOrigin, location } = params;
	let startDate, endDate;
	PublicAPI.findNearestAirport(location.city, location.state, function(hackathonError, nearestAirportToHackathon){
		if(hackathonError) {
			throw Error(hackathonError);
		}
		startDate = utils.formatDate(hackathon.startDate, hackathon.year);
		endDate = utils.formatDate(hackathon.endDate, hackathon.year);

		PublicAPI.getCheapestPrice(nearestAirportToOrigin.code, nearestAirportToHackathon.code, startDate, endDate, function(error, priceData){
			const { price, detailLink } = priceData;
			if(error) {
				throw Error(error);
			}

			console.log({ location, startDate, endDate, nearestAirportToHackathon, priceData });

			data = {
				hackathonName : hackathon.title,
				dates : [startDate, endDate],
				location : location.city + ', ' + location.state,
				originalLocationCode : nearestAirportToOrigin.code,
				airportLocation : nearestAirportToHackathon.city + ", " + nearestAirportToHackathon.state,
				airportCode :  nearestAirportToHackathon.code,
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