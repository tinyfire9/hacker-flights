var socket = io();

angular.module('hackerFlights.hackathons', ['ui.router'])
.config(function($stateProvider){
	$stateProvider.state('hackathons', {
		templateUrl : '/app/hackathons/hackathons.html',
		url : '/hackathons/:airportLocation',
		controller : 'hackathonsController'
	});
})
.controller("hackathonsController" ,function($scope, $rootScope, $stateParams){
	socket.emit('hackerFlights.airportLocation', { airportLocation : $stateParams.airportLocation});
	$scope.hackathons = [];
	socket.on('hackerFlights.hackathon', function(data){
		console.log(data);
		$rootScope.$apply(function(){
			$scope.hackathons.push(data.hackathon);
		});
		console.log($scope.hackathons.length);
	});
	$scope.loadingStarted = function(){
		return $scope.hackathons.length > 0;
	}
	$scope.loadingInProgress = function(){
		console.log($scope.hackathons.length)
		if($scope.hackathons[0] == null)
		{
			return true;
		}
		return $scope.hackathons[0].numberOfHackathons != $scope.hackathons.length;
	}
	$scope.showErrorMessage= function(){
		return $scope.hackathons[0] == null;
	}
});

// helper function that concatinates '0' on single digit numbers 
var pad = function(data){
	var count = 0;
	while(count < data.length)
	{
		for(var i = 0; i < data[count].dates.length; i++)
		{
			if(data[count].dates[i][0] < 10)
			{
				data[count].dates[i][0] = "0" + data[count].dates[i][0];
			}
			if(data[count].dates[i][1] < 10)
			{
				data[count].dates[i][1] = "0" + data[count].dates[i][1];
			}
		}
		count++;
	}
	return(data);
}