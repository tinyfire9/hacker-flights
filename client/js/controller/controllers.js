app.controller("redirect" , ['$scope', '$location',
	function($scope, $location)
	{
		$scope.displayHackathons = function()
		{
			console.log($scope.airportLocation);
			$location.path('/hackathons/' + $scope.airportLocation);
		}
	}
]);

app.controller("hackathonsList" , ['$scope', '$resource','$routeParams',
	function($scope, $resource,$routeParams)
	{
		var hacks = new $resource('/hackathons/' + $routeParams.airportLocation);
		hacks.query(function(data){
			$scope.hackathons = data;
		});
	}
]);