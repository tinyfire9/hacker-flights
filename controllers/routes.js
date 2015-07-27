var HackerFlights = require('./api/hackerFlights.js'),
		utils = require('./utils/utils.js'),
		airportLocation;

exports.hackathonsListResponseHandler = function(req, res){
	airportLocation = req.params.airportLocation;
	console.log('Departing from : ' + airportLocation + '~ working on request . . .');
	utils.locationExists(airportLocation, function(error, data){
		if(!data)
		{
			res.json(null);
		}
		else
		{
			HackerFlights.findFlights(data.code, function(error, info){
				if(error)
				{
					throw Error(error);
				}
				//console.log(info); //for debugging purpose
				res.json(info);
			});		
		}
	});

}