var request = require('request');
var apiKeys = require("./config.js");
var LocationInfo = require('./locationInfo.js');
var jsonpToJson = require('./jsonpToJson.js');

var NearestAirport = function(){}

NearestAirport.prototype.findOne = function(city, state, callback){
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

module.exports = NearestAirport;