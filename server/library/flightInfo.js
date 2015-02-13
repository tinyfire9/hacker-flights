var request = require('request');
var apiKeys = require("./config.js");

var FlightInfo = function(){}

FlightInfo.prototype.cheapestPrice = function(origin, destination, departureDate, returningDate, callback){

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
			"url": "https://www.googleapis.com/qpxExpress/v1/trips/search?key=" + apiKeys.googleapisKey,
				"headers": {
					    'Content-Type': 'application/json'
					},
				"body" : requestBody

			}, function(error, res, data){
				data = JSON.parse(data);
				//console.log(data);
				if(!data.trips.tripOption)
				{
					callback(null, "N/A");
				}
				else
				{
					callback(null, data.trips.tripOption[0].saleTotal);
				}
			});
}

module.exports = FlightInfo;