var mongoose = require('mongoose');
var collection = 'cities';

var cities = new mongoose.Schema({
	city : String,
	state : String,
	latitude : Number,
	longitude : Number
}, { collection : collection});

var model = mongoose.model(collection, cities);
module.exports = model;