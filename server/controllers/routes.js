var HackathonsInfo = require('../library/hackathonsInfo.js');
var fs = require('fs');

var Hackathons = new HackathonsInfo();

exports.hackathonsListResponseHandler = function(req, res){
	fs.readFile('./server/model/uptodateData.json', function(error, data){
		data = JSON.parse(data.toString('ascii'));
		res.json(data);
	});
}