var app = angular.module("myApp", ["ngRoute", "ngResource", "ngAnimate"]);

app.config(['$routeProvider',  function($routeProvider){
	
	$routeProvider
		.when('/', 
			{
				controller : "redirect"
		})
		.when('/hackathons/:airportLocation', 
			{
				templateUrl : "views/hackathons.html",
				controller : "hackathonsList"
		});
}]);