var request = require('request');
var apiKeys = require("./config.js");
var LocationInfo = require('./locationInfo.js');
var jsonpToJson = require('./jsonpToJson.js');

var Airport = function(){}

Airport.prototype.findNearestAirport = function(city, state, callback){
	var NearestAirport;

	LocationInfo.prototype.toLongtudeAndLatitude(city, state, function(error, location){
		if(error)
		{
			throw Error(error);
		}
		request.get({
			"url" : "https://airport.api.aero/airport/nearest/" + location.latitude + "/" + location.longtude + "?user_key=" + apiKeys.sitaKey,
			"headers" : {"content-type" : "application/json"}
		},function(error, res, data){
			data = jsonpToJson(data);

			NearestAirport = {
				code : data.airports[0].code,
				name : data.airports[0].name,
				city : data.airports[0].city,
				country : data.airports[0].country
			}
			callback(null, NearestAirport);
		});
	});
}

Airport.prototype.exists = function(location, callback){
	var info;
	request.get({
			"url" : "https://airport.api.aero/airport/match/" + location + "?user_key=" + apiKeys.sitaKey,
			"headers" : {"content-type" : "application/json"}
		},function(error, data){
			if(error)
			{
				throw Error(error);
			}
			data = jsonpToJson(data.body.toString());
			if(data.airports.length == 0)
			{
				info = null;
			}
			else
			{
				info = {
					code : data.airports[0].code,
					country : data.airports[0].country
				}
			}
			callback(null, info);
		});
}

module.exports = Airport;