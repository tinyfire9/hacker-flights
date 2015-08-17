angular.module('hackerFlights', ['ui.router', 'hackerFlights.home','hackerFlights.hackathons'])
	.config(function($locationProvider){
		$locationProvider.html5Mode(true);
	});