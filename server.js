var app = require('express')();
var bodyParser = require('body-parser');
var serverStatic = require('serve-static');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var routes = require('./controllers/routes.js');
var hackerFlights = require('./controllers/api/hackerFlights.js');
var fs = require('fs');

app.use(serverStatic(__dirname + '/client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(methodOverride());


switch(app.get('env'))
{
	case "development":
		app.use(errorHandler({dumpExceptions : true, showStack: true}));
		break;
	case "production":
		app.use(errorHandler());
		break;
}


app.get('/hackathons/:airportLocation', routes.hackathonsListResponseHandler);

app.get('*', function(req, res){
	res.sendFile(__dirname + '/client/views/index.html');
});

setInterval(function(){
	hackerFlights.tryNotifyingAPIUsage();
}, 1500)

app.listen(process.env.PORT || 3000, function(){
	console.log("Server running ...")
});
