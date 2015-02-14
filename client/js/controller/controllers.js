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
		$scope.loading = true;
		var hacks = new $resource('/hackathons/' + $routeParams.airportLocation);
		hacks.query(function(data){
			data = pad(data);
			$scope.hackathons = data;
			$scope.loading = false;	
		});
	}
]);




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