var utils = require('../utils/utils.js');
var request = require('request');

var PublicAPI = function(){}

PublicAPI.prototype.findNearestAirport = function(city, state, callback){
	var NearestAirport;
	utils.getLongtudeAndLatitude(city, state, function(error, location){
		if(error)
		{
			throw Error(error);
		}
		request.get({
			"url" : "https://airport.api.aero/airport/nearest/" + location.latitude + "/" + location.longtude + "?user_key=" + process.env.sitaKey,
			"headers" : {"content-type" : "application/json"}
		},function(error, res, data){
			data = utils.jsonpToJson(data);

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

PublicAPI.prototype.getCheapestPrice = function(origin, destination, departureDate, returningDate, callback){

var requestBody = JSON.stringify({
						  "request": 
						  {
						    "passengers": 
						    {
						      "adultCount": 1
						    },
						    "slice": 
						    [
						      {
						        "origin": origin,
						        "destination": destination,
						        "date": departureDate[2] + "-" + departureDate[0] + "-" +departureDate[1] // YYYY-MM-DD
						      },
						      {
						        "origin": destination,
						        "destination": origin,
						        "date": returningDate[2] + "-" + returningDate[0] + "-" +returningDate[1] // YYYY-MM-DD
						      }
						    ]
						  }
						});

request.post({ 
			//Google QPX-Express API
			"url": "https://www.googleapis.com/qpxExpress/v1/trips/search?key=" + process.env.googleAPIKey,
				"headers": {
					    'Content-Type': 'application/json'
					},
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
	var time = 1000;
	var allHackathons = [];
	var urls = utils.getUrls();
	var size = urls.length;
	urls.forEach(function(hackathons, i){
		utils.getHackathons(urls[i], function(hackathons){
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
	}, urls.length* 500);
}

module.exports = new PublicAPI();