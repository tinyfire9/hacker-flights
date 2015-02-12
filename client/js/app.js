var app = angular.module("myApp", ["ngRoute", "ngResource"]);

app.config(['$routeProvider',  function($routeProvider){
	
	$routeProvider
		.when('/', 
			{templateUrl : "views/location.html"})
		.when('/hackathons/:location', 
			{
				templateUrl : "views/hackathons.html",
				controller : "hackathonsListController"
		});
}]);