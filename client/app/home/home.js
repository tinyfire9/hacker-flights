angular.module('hackerFlights.home', [])
	.config(function($stateProvider){
		$stateProvider.state('home', {
			url : '/',
			templateUrl : '/app/home/home.html',
			controller : 'homeController'
		});
	})
	.controller('homeController', function($scope, $location){
		socket.on('hackerFlights.placesAutoComplete', ({ places }) => {
		});

		$scope.listAutocompletePlaces = function() {
			socket.emit('hackerFlights.listAutocompletePlaces', {
				input: $scope.airportLocation,
			});
		}

		$scope.listPrices = function(airportLocation){
			$location.path('/hackathons/' + airportLocation);
		}
	});