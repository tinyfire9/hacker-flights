var app = require('express')();
var bodyParser = require('body-parser');
var serverStatic = require('serve-static');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var events = require('./controllers/events.js');
var hackerFlights = require('./controllers/api/hackerFlights.js');
var path = require('path');
var socket = require('socket.io');
var io;
app.use(serverStatic(path.join(__dirname, '/client')));
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

app.get('*', function(req, res){
	res.sendFile(path.join(__dirname, 'client/index.html'));
});

io = socket.listen(app.listen(process.env.PORT || 3000, function(){
	console.log("Server running ...");
}));


io.on('connection', function(socket){
	socket.on('hackerFlights.airportLocation', function(data){
		events.hackathonsListResponseHandler(data.airportLocation, socket);
	});
});