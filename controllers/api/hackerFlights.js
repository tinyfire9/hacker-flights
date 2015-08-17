var utils = require('../utils/utils.js');
var PublicAPI = require('./publicAPI.js');
var hackathons = require('../../models/data.js');
var queriesModel = require('../../models/queries.js');
var flightPrices = [];

var HackerFlights = function(){}

HackerFlights.prototype.findFlights = function(origin, socket){
	var HackathonLength, hackathonBeginningDate, hackathonEndingDate, queries, price;

	hackathons.forEach(function(hackathon, index){
		PublicAPI.findNearestAirport(hackathon.location.city, hackathon.location.state, function(error, nearestAirportInfo){
			if(error)
			{
				throw Error(error);
			}
			HackathonLength = hackathon.dates.length;
			hackathonBeginningDate = hackathon.dates[0];
			hackathonEndingDate = hackathon.dates[HackathonLength - 1];
			PublicAPI.getCheapestPrice(origin, nearestAirportInfo.code, hackathonBeginningDate, hackathonEndingDate, function(error, price){
				if(error)
				{
					throw Error(error);
				}
				data = {
					hackathonName : hackathon.hackathonName,
					dates : hackathon.dates,
					location : hackathon.location,
					originalLocationCode : origin,
					nearestAirport : nearestAirportInfo.name,
					airportLocation : nearestAirportInfo.city + ", " + nearestAirportInfo.country,
					airportCode :  nearestAirportInfo.code,
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