var mongoose = require('mongoose'),
schema = mongoose.Schema,
collection = 'queries';

var queries = new schema({
	date : Date,
	data : Array
},
{
	collection : collection
});

var queriesModel = mongoose.model(collection, queries);

module.exports = queriesModel;