var request = require('request');
var apiKeys = require("./config.js");

var LocationInfo = function(){}

LocationInfo.prototype.toLongtudeAndLatitude = function(city, state, callback){
	var location;
	request.get({
		//Google Geocoding API
		"url" : "https://maps.googleapis.com/maps/api/geocode/json?address=" + city + ",+" + state + "&key=" + apiKeys.googleapisKey,
	}, function(error, res, data){
		data = JSON.parse(data);
		location = {"latitude" : data.results[0].geometry.location.lat, 
					"longtude" : data.results[0].geometry.location.lng
					}
		callback(null, location);
	});
}

module.exports = LocationInfo;