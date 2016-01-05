var utils = require('../utils/utils.js');
var PublicAPI = require('./publicAPI.js');
var models = require('../../models/models.js');
var queriesModel = models.queries;
var airportsModel = models.airports;
var flightPrices = [];

var HackerFlights = function(){}

HackerFlights.prototype.findFlights = function(city, state, socket){
	var startDate, endDate, queries, price;
	PublicAPI.findNearestAirport(city, state, function(originError, nearestAirportToOrigin){
		if(originError)
		{
			throw Error(originError);
		}

		PublicAPI.getHackathons(function(hackathons){
			hackathons.forEach(function(hackathon, index){
				var location = utils.parseLocation(hackathon.city);
				PublicAPI.findNearestAirport(location.city, location.state, function(hackathonError, nearestAirportToHackathon){
					if(hackathonError)
					{
						throw Error(hackathonError);
					}
					startDate = utils.formatDate(hackathon.startDate, hackathon.year);
					endDate = utils.formatDate(hackathon.endDate, hackathon.year);
					PublicAPI.getCheapestPrice(nearestAirportToOrigin.code, nearestAirportToHackathon.code, startDate, endDate, function(error, price){
						if(error)
						{
							throw Error(error);
						}
						data = {
							hackathonName : hackathon.title,
							dates : [startDate, endDate],
							location : location.city + ', ' + location.state,
							originalLocationCode : nearestAirportToOrigin.code,
							airportLocation : nearestAirportToHackathon.city + ", " + nearestAirportToHackathon.state,
							airportCode :  nearestAirportToHackathon.code,
							startingPrice : price,
							numberOfHackathons : hackathons.length
						};
						flightPrices.push(data);
						socket.emit('hackerFlights.hackathon', { 
							hackathon : data,
							status : 200,
							message : null 
						});
						if(hackathons.length == flightPrices.length - 1)
						{
							queries = new queriesModel({
								date : new Date().toDateString(),
								data : flightPrices
							});
							queries.save(function(){
								flightPrices = [];
							})
						}
					});
				});
			});
		});
	});
}

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