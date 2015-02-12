var Airport = require('./airport.js');
var FlightInfo = require('./flightInfo.js');
var fs = require('fs');
var hackathonsInfo = [];
var hackathons = require('../model/data.js')

var flightInfo = new FlightInfo();
var Airport = new Airport();

var HackathonsInfo = function(){}

HackathonsInfo.prototype.findInfo = function(origin, callback){
	var HackathonLength;
	var hackathonBeginningDate;
	var hackathonEndingDate;

	for(var hackathon = 0; hackathon < hackathons.length; hackathon++)
	{
		(function(hackathon)
			{
				Airport.findNearestAirport(hackathons[hackathon].location.city, hackathons[hackathon].location.state, function(error, nearestAirportInfo){
					if(error)
					{
						throw Error(error);
					}
					HackathonLength = hackathons[hackathon].dates.length;
					hackathonBeginningDate = hackathons[hackathon].dates[0];
					hackathonEndingDate = hackathons[hackathon].dates[HackathonLength - 1];
					flightInfo.cheapestPrice(origin, nearestAirportInfo.code, hackathonBeginningDate, hackathonEndingDate, function(error, price){
						if(error)
						{
							throw Error(error);
						}

						hackathonsInfo.push({
							"hackathonName" : hackathons[hackathon].hackathonName,
							"dates" : hackathons[hackathon].dates,
							"location" : hackathons[hackathon].location,
							"originalLocationCode" : origin,
							"nearestAirport" : nearestAirportInfo.name,
							"airportLocation" : nearestAirportInfo.city + ", " + nearestAirportInfo.country,
							"airportCode" :  nearestAirportInfo.code,
							"startingPrice" : price
						});
						//console.log(hackathonsInfo + "---");
						//console.log(hackathon + "<-index--arrayLeng->" + hackathons.length);
						if(hackathon == hackathons.length - 1)
						{
							callback(null, hackathonsInfo);
						}
					});
				});
				
			})(hackathon)
	}
}

module.exports = HackathonsInfo;