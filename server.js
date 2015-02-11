var express = require('express');
var bodyParser = require('body-parser');
var serverStatic = require('serve-static');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var fs = require('fs');
var routes = require('./server/controllers/routes.js');
var HackathonsInfo = require('./server/library/hackathonsInfo.js');
var app = express();
var Hackathons = new HackathonsInfo();

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

app.get('/hackathons', routes.indexResponseHandler);

app.get('*', function(req, res){
	res.sendFile(__dirname + '/client/views/index.html');
});



setInterval(function(){
	Hackathons.findInfo("MSP", function(error, info){
		console.log("Updating data!");
		info = JSON.stringify(info);
		fs.writeFileSync("./model/uptodateData.json", info);
	});
}, 60000 * 60 * 12);

app.listen(process.env.PORT || 3000, function(){
	console.log("Server running ...")
});
