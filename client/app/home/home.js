angular.module('hackerFlights.home', [])
	.config(function($stateProvider){
		$stateProvider.state('home', {
			url : '/',
			templateUrl : '/app/home/home.html',
			controller : 'homeController'
		});
	})
	.controller('homeController', function($scope, $location){
		$scope.listPrices = function(airportLocation){
			$location.path('/hackathons/' + airportLocation);
		}
	});