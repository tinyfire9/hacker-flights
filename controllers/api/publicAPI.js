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
			console.log({ error });
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
	const url = utils.getSkypickerURL(origin, destination, departureDate, returningDate);

	const getPriceOuput = (price = '', detailLink = '') => {
		return { price, detailLink };
	}

	console.log('INFO :: ', origin, destination, departureDate, returningDate);

	request.get({ 
		url,
		headers: { 'Content-Type': 'application/json' },
		}, function(error, res, data){
			data = JSON.parse(data);
			try {
				const output = data.data.length > 0 ?
					getPriceOuput(data.data[0].price, data.data[0].deep_link) :
					getPriceOuput();
				callback(null, output);
			}
			catch(error)
			{
				console.log(error);
				callback(null, getPriceOuput());
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
					//check if the hackathon is in the US
					if(hackathon.city.toLowerCase().search('united states') != -1)
					{
						allHackathons.push(hackathon);
					}
				});
			}
		});
	});
	setTimeout(function() {
		callback(allHackathons);
	}, urls.length* time);
}

module.exports = new PublicAPI();