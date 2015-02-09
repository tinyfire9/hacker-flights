var express = require('express');
var bodyParser = require('body-parser');
var serverStatic = require('serve-static');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var fs = require('fs');
var routes = require('./server/controllers/routes.js');
var app = express();

app.use(serverStatic(__dirname + 'client'));
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

app.get('/', routes.indexResponseHandler);


setInterval(function(){
	Hackathons.findInfo("SFO", function(error, info){
		info = JSON.stringfy(info);
		fs.writeFileSync("../model/uptodateData.js", info);
	});
},  60000 * 60 * 24);

app.listen(process.env.PORT || 3000, function(){
	console.log("Server running ...")
});