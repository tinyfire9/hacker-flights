var request = require('request'),
	nodemailer = require('nodemailer'),
	config = require('../../config.js'),
	xlsx = require('node-xlsx'),
	models = require('../../models/models.js');

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

Utils.prototype.getSkypickerURL = function(origin, destination, departureDate, returningDate) {
	const baseURL = 'https://api.skypicker.com';
	const route = '/flights';
	let paramsString = '';
	const paramsList = [
		{key: 'curr', value: 'USD'},
		{key: 'partner', value: 'picky'},
		{key: 'date_from', value: departureDate},
		{key: 'date_to', value: departureDate},
		{key: 'return_from', value: returningDate},
		{key: 'return_to', value: returningDate},
		{key: 'fly_from', value: origin},
		{key: 'fly_to', value: destination},
	];

	paramsList.forEach((param, i) => {
		paramsString += `${param.key}=${param.value}`;
		if((i != paramsList.length-1) && (paramsList.length != 0)) {
			paramsString += '&';
		}
	});

	return `${baseURL+route}?${paramsString}`;
}

Utils.prototype.getUrls = function(){
	var baseUrl = 'http://www.hackalist.org';
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var urls = [];
	var endPoint;
	var key;
	//for this and the coming year - try getting data on each upcoming month
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

	// urls.push('http://www.hackalist.org/api/1.0/2018/09.json');

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

Utils.prototype.getTop10NearestAirportsFromLocation = function(location, callback) {
	models.airports.find({}, function(error, airports){
		if(error) {
			console.log(Error(error));
		}
		
		const top10NearestAirports = airports.sort((airport1, airport2) => {
			let distance1 = Math.sqrt(
				Math.pow(location.latitude - airport1.latitude, 2) + 
				Math.pow(location.longitude - airport1.longitude, 2)
			);
			let distance2 = Math.sqrt(
				Math.pow(location.latitude - airport2.latitude, 2) +
				Math.pow(location.longitude - airport2.longitude, 2)
			);

			if ( distance1 < distance2 ) {
				return -1;
			} else if ( distance1 > distance2 ) {
				return 1;
			}

			return 0;
		})
		.slice(0, 10)
		.map(
			({ code, city, state}) => ({ code, city, state }),
		);

		callback(null, top10NearestAirports);
	});
}

Utils.prototype.getLongtudeAndLatitude = function(city, state, callback){
	const doCallback = (longitude=null, latitude=null, error=false) => {
		const location = { longitude, latitude };
		if(error) {
			console.log("ERROR on util.getLongtudeAndLatitude() : ", error);
		}

		callback(null, location);
	}

	request.get({
		//Google Geocoding API
		"url" : "https://maps.googleapis.com/maps/api/geocode/json?address=" + city + ",+" + state + "&key=" + process.env.googleAPIKey,
	}, function(error, res, data){
		data = JSON.parse(data);
		if(data.error_message) {
			doCallback(null, null, data.error_message)
		}
		try {
			const latitude = data.results[0].geometry.location.lat;
			const longitude = data.results[0].geometry.location.lng;

			doCallback(longitude, latitude);
		}
		catch(error) {
			doCallback(null, null, error);
		}
	});
}

Utils.prototype.getLocations = function(){
	var file = xlsx.parse(__dirname + '/cities.xlsx');
	var locations = [];
	file[0].data.splice(0,1);//remove header
	file[0].data.forEach(function(row, i){
		var location = {
			city : row[2],
			state : row[1],
			latitude : row[3],
			longitude : row[4]
		};
		locations.push(location);
	});
	return locations;
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
	return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`;
}	

Utils.prototype.locationExists = function(city, state, callback){
	models.cities.findOne({city : city, state : state}, function(error, location){
		if(!location)
		{
			callback(false);
		}
		else
		{
			callback(true);
		}
	});
}

Utils.prototype.parseLocation = function(location){
	var location = location.split(', ');
	return {
		city : location[0],
		state : location[1]
	};
}


var utils = new Utils();
module.exports = utils;