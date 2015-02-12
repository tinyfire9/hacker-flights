var HackathonsInfo = require('../library/hackathonsInfo.js');
var Airport = require('../library/airport.js');

var Hackathons = new HackathonsInfo();
var Airport = new Airport();
var airportLocation;
exports.hackathonsListResponseHandler = function(req, res){
	airportLocation = req.params.airportLocation;
	Airport.exists(airportLocation, function(error, data){
		if(data == null)
		{
			res.json(null);
		}
		else
		{
			Hackathons.findInfo(data.code, function(error, info){
				if(error)
				{
					throw Error(error);
				}
				console.log(info);
				res.json(info);
			});		
		}
	});

}