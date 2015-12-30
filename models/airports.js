var mongoose = require('mongoose'),
schema = mongoose.Schema,
collection = 'airports',
model, airports;

airports = new schema({
	code : String,
	city : String,
	state : String,
	latitude : Number,
	longitude : Number
}, {collection : collection});

model = mongoose.model(collection, airports);
module.exports = model;

