var request = require('request');

var apiKey = "AIzaSyB9hM_NgN31WNcBufpKqwTEwHdCjuekndQ";
var baseUrl = "https://maps.googleapis.com/maps/api/place/textsearch/json?";
var keyParam = "key=" + apiKey;
var query = "query=airport";
var and = "&";
var location = "location=47.487536/-94.885849";
var radiusParam = "radius=50000";
var type = "types=airport";
var language = "language=en";
var url = baseUrl+keyParam+and+location+and+language+and+type+and+radiusParam+and+query;
// console.log("Heyyy",url)
// request.get({
// 	"url" : url,
// 	"headers" : {"content-type" : "application/json"}
// },function(error, res, data){
// 	console.log(data);
// });


var url = 'http://www.hackalist.org/api/1.0/2015/01.json';

request.get({
	"url" : url,
	"headers" : {"content-type" : "application/json"}
}, function(error, res, data){
	console.log(data);
});
