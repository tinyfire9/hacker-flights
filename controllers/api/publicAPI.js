'use strict'
var utils = require('../utils/utils.js');
var models = require('../../models/models.js');
var request = require('request');

var PublicAPI = function(){}

PublicAPI.prototype.findNearestAirport = function(city, state, callback){
	var nearestDistance = Infinity;
	var nearestAirport = {
		name : null,
		code : null,
		city : null,
		state : null
	};
	utils.getLongtudeAndLatitude(city, state, function(error, location){
		models.airports.find({}, function(error, airports){
			if(error)
			{
				console.log(Error(error));
			}
			airports.forEach(function(airport, i){
				var distance = Math.sqrt(
					Math.pow(location.latitude - airport.latitude, 2) + 
					Math.pow(location.longitude - airport.longitude, 2)
					);
				if( distance < nearestDistance )
				{
					nearestDistance = distance;
					nearestAirport = airport;
				}

				if(i == airports.length-1)
				{
					nearestAirport = {
						code : nearestAirport.code,
						city : nearestAirport.city,
						state : nearestAirport.state
					}
					callback(null, nearestAirport);
				}
			});
		});
	});
}

PublicAPI.prototype.getCheapestPrice = function(origin, destination, departureDate, returningDate, callback){
var requestBody = JSON.stringify({
	"request": {
	    "passengers": { "adultCount": 1 },
	    "slice": [{
	        "origin": origin,
	        "destination": destination,
	        "date": departureDate // YYYY-MM-DD
	      },
	      {
	        "origin": destination,
	        "destination": origin,
	        "date": returningDate // YYYY-MM-DD
	      }
	    ]
	  }
	});
	request.post({ 
		//Google QPX-Express API
		"url": "https://www.googleapis.com/qpxExpress/v1/trips/search?key=" + process.env.googleAPIKey,
			"headers": { 'Content-Type': 'application/json' },
			"body" : requestBody
		}, function(error, res, data){
			data = JSON.parse(data);
			try
			{
				callback(null, data.trips.tripOption[0].saleTotal);
			}
			catch(error)
			{
				console.log(error);
				callback(null, "N/A");
			}
	});
}

PublicAPI.prototype.getHackathons = function(callback){
	var time = 500;
	var allHackathons = [];
	var urls = utils.getUrls();
	var size = urls.length;
	urls.forEach(function(hackathons, i){
		utils.httpRequest(urls[i], function(hackathons){
			if(hackathons)
			{
				hackathons.forEach(function(hackathon, j){
					allHackathons.push(hackathon);
				});
			}
		});
	});
	setTimeout(function() {
		callback(allHackathons);
	}, urls.length* time);
}

module.exports = new PublicAPI();