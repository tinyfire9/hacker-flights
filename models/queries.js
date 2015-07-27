var mongoose = require('mongoose'),
		schema = mongoose.Schema;

mongoose.connect('mongodb://db_user:db_password@ds047732.mongolab.com:47732/heroku_46tnnbb3')

var queries = new schema({
	date : Date,
	data : Array
},
{
	collection : 'queries'
});

var queriesModel = mongoose.model('queries', queries);

module.exports = queriesModel;