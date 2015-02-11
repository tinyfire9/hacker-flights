//helper function

var jsonpToJson = function(string){
	//format of string : "callback({"processingDurationMillis":10,"authorisedAPI":true,"success":true,"airline":null,"errorMessage":null,"airports":[{"code":"ONT","name":"Ontario Intl","city":"Ontario","country":"United States","lat":34.056,"lng":-117.601194,"terminal":null,"gate":null,"timezone":"America/Los_Angeles"},null]})"
	//remove "callback(" at the beginning of the string and ")" at the end of the string
	//parse to JSON format
	string = string.substring(9, string.length - 1);
	string = JSON.parse(string);
	return(string);
}

module.exports = jsonpToJson;