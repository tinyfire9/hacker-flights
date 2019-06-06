'use strict'
var utils = require('../utils/utils.js');
var models = require('../../models/models.js');
var request = require('request');

var PublicAPI = function(){}

PublicAPI.prototype.findNearestAirport = function(city, state, callback){
	utils.getLongtudeAndLatitude(city, state, function(error, location){
		utils.getNearestAirportFromLocation(location, (err, nearestAirport) => {
			callback(null, nearestAirport);
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