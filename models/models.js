var mongoose = require('mongoose'),
connection = 'mongodb://db_user:db_password@ds047732.mongolab.com:47732/heroku_46tnnbb3';
mongoose.connect(connection);

module.exports = {
	queries : require('./queries.js'),
	airports : require('./airports.js'),
	cities : require('./cities.js')
};