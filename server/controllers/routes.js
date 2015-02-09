var HackathonsInfo = require('../library/hackathonsInfo.js');
var data = require('../model/uptodateData.js');

var Hackathons = new HackathonsInfo();

exports.indexResponseHandler = function(req, res){
	res.send(data);
}