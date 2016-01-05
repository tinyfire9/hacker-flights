// var hackerFlights = require('./hackerFlights.js');
// console.log("heeyy");
// hackerFlights.updateLocations(function() {
// 	console.log("status : DONE");
// })

var api = require('./publicAPI.js')
// api.getHackathons(function(hackathons){
// 	console.log('---------------------> Size : ', hackathons.length)
// });
api.findNearestAirport('cass lake', 'Mn', function(error, airport){
	console.log(error || airport);
})
