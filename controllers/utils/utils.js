var request = require('request'),
	nodemailer = require('nodemailer'),
	config = require('../../config.js'),
	xlsx = require('node-xlsx');

var Utils = function(){}

Utils.prototype.httpRequest = function(url, callback){
	var data = '';
	request.get({
		"url" : url,
		"headers" : {"content-type" : "application/json"}
	}, function(error, res, data){
		try{
			data = JSON.parse(data);
			callback(data[Object.keys(data)]);
		}
		catch(error)
		{
			callback(null);

		}
	});
}

Utils.prototype.getUrls = function(){
	var baseUrl = 'http://www.hackalist.org';
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var urls = [];
	var endPoint;
	var key;
	//for this and the coming year - try getting data each upcoming month
	for (var i = year; i <= year+1; i++) {
		if(i == year + 1){ j= 1; }
		else { j = month; }

		for (j; j <= 12; j++) {
			if(j < 10)
			{
				endPoint = '/api/1.0/' + i + '/0' + j + '.json';
			}
			else
			{
				endPoint = '/api/1.0/' + i + '/' + j + '.json';
			}
			urls.push(baseUrl + endPoint);
		};
	};
	return urls;
}

Utils.prototype.getAirports = function(path){
	var data = xlsx.parse(path);
	var airports = [];
	data[0].data.forEach(function(row, i) {
		if(i > 6 && i < 501)
		{
			var airport = {};
			airport.code = row[2];//airport code
			airport.city = row[3];//city
			airport.state = row[0];//state
			airports.push(airport);
		}
	});
	return airports;
}
Utils.prototype.jsonpToJson = function(string){
	//general format of the parameter : "callback({"processingDurationMillis":10,"authorisedAPI":true,"success":true,"airline":null,"errorMessage":null,"airports":[{"code":"ONT","name":"Ontario Intl","city":"Ontario","country":"United States","lat":34.056,"lng":-117.601194,"terminal":null,"gate":null,"timezone":"America/Los_Angeles"},null]})"
	//removes "callback(" at the beginning of the string and ")" at the end of the string
	//then parses the string to JSON format
	string = string.substring(9, string.length - 1);
	string = JSON.parse(string);
	return(string);
}

Utils.prototype.getLongtudeAndLatitude = function(city, state, callback){
	var location, data = '';
	request.get({
		//Google Geocoding API
		"url" : "https://maps.googleapis.com/maps/api/geocode/json?address=" + city + ",+" + state + "&key=" + process.env.googleAPIKey,
	}, function(error, res, data){
		data = JSON.parse(data);
		try
		{
			location = {
				latitude : data.results[0].geometry.location.lat, 
				longitude : data.results[0].geometry.location.lng
			}
		}
		catch(error)
		{
			console.log("ERROR on util.getLongtudeAndLatitude() : ", error);
		}
		callback(null, location);
	});
}

Utils.prototype.locationExists = function(location, callback){
	var info;
	request.get({
			"url" : "https://airport.api.aero/airport/match/" + location + "?user_key=" + process.env.sitaKey,
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

Utils.prototype.formatDate = function(date, year){
	var date = new Date(date + ', ' + year);
	return date.getFullYear() + '-' + date.getMonth() + 1 + '-' + date.getDate();
}	

var utils = new Utils();
module.exports = utils;