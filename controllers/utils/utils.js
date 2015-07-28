var request = require('request'),
		nodemailer = require('nodemailer');
		config = require('../../config.js');

var Utils = function(){}

Utils.prototype.jsonpToJson = function(string){
	//general format of the parameter : "callback({"processingDurationMillis":10,"authorisedAPI":true,"success":true,"airline":null,"errorMessage":null,"airports":[{"code":"ONT","name":"Ontario Intl","city":"Ontario","country":"United States","lat":34.056,"lng":-117.601194,"terminal":null,"gate":null,"timezone":"America/Los_Angeles"},null]})"
	//removes "callback(" at the beginning of the string and ")" at the end of the string
	//then parses the string to JSON format
	string = string.substring(9, string.length - 1);
	string = JSON.parse(string);
	return(string);
}

Utils.prototype.getLongtudeAndLatitude = function(city, state, callback){
	var location;
	request.get({
		//Google Geocoding API
		"url" : "https://maps.googleapis.com/maps/api/geocode/json?address=" + city + ",+" + state + "&key=" + 'AIzaSyDQLzuPYH99gZqv5vbVgb0FwqaHw1kBraI',
	}, function(error, res, data){
		data = JSON.parse(data);
		location = {latitude : data.results[0].geometry.location.lat, 
					longtude : data.results[0].geometry.location.lng
					}
		callback(null, location);
	});
}

Utils.prototype.locationExists = function(location, callback){
	var info;
	request.get({
			"url" : "https://airport.api.aero/airport/match/" + location + "?user_key=" + '7a7ca24e323cecc6b30926c4eceddd43',
			"headers" : {"content-type" : "application/json"}
		},function(error, data){
			if(error)
			{
				throw Error(error);
			}
			data = utils.jsonpToJson(data.body.toString());
			if(data.airports.length == 0)
			{
				info = null;
			}
			else
			{
				info = {
					code : data.airports[0].code,
					country : data.airports[0].country
				}
			}
			callback(null, info);
		});
}
Utils.prototype.sendEmail = function(email, message){
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: config.email,
            pass: config.password
        }
    });
    var mailOptions = {
        from: 'hackerFlights@gmail.com',
        to: email,
        subject: 'hackerFlights QPX-Express api usage', 
        html: message 
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Message sent: ' + info.response);
        }
    });
}

var utils = new Utils();
module.exports = utils;