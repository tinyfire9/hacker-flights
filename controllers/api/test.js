// var hackerFlights = require('./hackerFlights.js');
// console.log("heeyy");
// hackerFlights.updateLocations(function() {
// 	console.log("status : DONE");
// })

var api = require('./publicAPI.js')
// api.getHackathons(function(hackathons){
// 	console.log('---------------------> Size : ', hackathons.length)
// });
// api.findNearestAirport('cass lake', 'Mn', function(error, airport){
// 	console.log(error || airport);
// })

// MSN YNG 2016-11-5 2016-11-7
api.getCheapestPrice('MSP','SFO','11/06/2019','20/06/2019', function(err, res) {
	// body...

	console.log(err, res)
})