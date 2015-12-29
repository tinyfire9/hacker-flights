var queriesModel = require('./queries.js');

var myQueries = new queriesModel({
	date : new Date().toDateString(),
	data : "HeeYYYY"
});
console.log(myQueries);
myQueries.save(function(){
	console.log("Heyyy");
});
