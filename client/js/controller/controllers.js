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
		$scope.inputError = false;
		/*
		var hacks = new $resource('/hackathons/' + $routeParams.airportLocation);
		hacks.query(function(data){
			if(data.length == 0)
			{
				$scope.inputError = true;
			}
			data = pad(data);
			$scope.hackathons = data;
			$scope.loading = false;	

		});*/
	$scope.hackathons = [
		{	
			"hackathonName" : "Hackpoly",
			"dates" : [[2, 20, 2015], [2, 21, 2015]],
			"location" : {
				"city" : "Pomona",
				"state" : "CA"
			}
		},
		{	
			"hackathonName" : "TreeHacks",
			"dates" : [[2, 20, 2015], [2, 21, 2015]],
			"location" : {
				"city" : "Stanford",
				"state" : "CA"
			}
		},
		{	
			"hackathonName" : "UHack",
			"dates" : [[2, 21, 2015], [2, 22, 2015]],
			"location" : {
				"city" : "Miami",
				"state" : "FL"
			}
		},
		{	
			"hackathonName" : "HackDFW",
			"dates" : [[2, 28, 2015], [3, 1, 2015]],
			"location" : {
				"city" : "Dallas",
				"state" : "TX"
			}
		},
		{	
			"hackathonName" : "HackTCNJ",
			"dates" : [[2, 28, 2015], [3, 1, 2015]],
			"location" : {
				"city" : "Ewing Township",
				"state" : "NJ"
			}
		},
		{	
			"hackathonName" : "Hack.UVA",
			"dates" : [[2, 28, 2015], [3, 1, 2015]],
			"location" : {
				"city" : "Charlottesville",
				"state" : "VA"
			}
		},
		{	
			"hackathonName" : "Hack Arizona",
			"dates" : [[3, 6, 2015], [3, 7, 2015], [3, 8, 2015]],
			"location" : {
				"city" : "Tucson",
				"state" : "AZ"
			}
		},
		{	
			"hackathonName" : "HackBU",
			"dates" : [[3, 20, 2015], [3, 21, 2015], [3, 22, 2015]],
			"location" : {
				"city" : "Binghamton",
				"state" : "NY"
			}
		},
		{	
			"hackathonName" : "HackFSU",
			"dates" : [[3, 20, 2015], [3, 21, 2015], [3, 22, 2015]],
			"location" : {
				"city" : "Tallahassee",
				"state" : "FL"
			}
		},
		{	
			"hackathonName" : "PearlHacks",
			"dates" : [[3, 21, 2015], [3, 22, 2015]],
			"location" : {
				"city" : "Chapel Hill",
				"state" : "NC"
			}
		},
		{	
			"hackathonName" : "HackWestern",
			"dates" : [[3, 27, 2015], [3, 28, 2015], [3, 29, 2015]],
			"location" : {
				"city" : "London",
				"state" : "ON"
			}
		},
		{	
			"hackathonName" : "SteelHacks",
			"dates" : [[3, 27, 2015], [3, 28, 2015], [3, 29, 2015]],
			"location" : {
				"city" : "Pittsburgh",
				"state" : "PA"
			}
		},
		{	
			"hackathonName" : "HackPSU",
			"dates" : [[3, 28, 2015], [3, 29, 2015]],
			"location" : {
				"city" : "State College",
				"state" : "PA"
			}
		},
		{	
			"hackathonName" : "HackHolyoke",
			"dates" : [[4, 3, 2015], [4, 4, 2015]],
			"location" : {
				"city" : "South Hadley",
				"state" : "MA"
			}
		},
		{	
			"hackathonName" : "Bitcamp",
			"dates" : [[4, 10, 2015], [4, 11, 2015], [4, 12, 2015]],
			"location" : {
				"city" : "College Park",
				"state" : "MD"
			}
		},
		{	
			"hackathonName" : "HackUMass",
			"dates" : [[4, 11, 2015], [4, 12, 2015]],
			"location" : {
				"city" : "Amherst",
				"state" : "MD"
			}
		},
		{	
			"hackathonName" : "MadHacks",
			"dates" : [[4, 17, 2015], [4, 18, 2015], [4, 19, 2015]],
			"location" : {
				"city" : "Madison",
				"state" : "WI"
			}
		},
		{	
			"hackathonName" : "OwlHacks",
			"dates" : [[4, 17, 2015], [4, 18, 2015], [4, 19, 2015]],
			"location" : {
				"city" : "Philadelphia",
				"state" : "PA"
			}
		},
		{	
			"hackathonName" : "BrickHacks",
			"dates" : [[4, 18, 2015], [4, 19, 2015]],
			"location" : {
				"city" : "Rochester",
				"state" : "NY"
			}
		},
		{	
			"hackathonName" : "HacksRU",
			"dates" : [[4, 18, 2015], [4, 19, 2015]],
			"location" : {
				"city" : "New Burnswick",
				"state" : "NJ"
			}
		},
		{	
			"hackathonName" : "RedbirdHacks",
			"dates" : [[4, 24, 2015], [4, 25, 2015], [4, 26, 2015]],
			"location" : {
				"city" : "Normal",
				"state" : "IL"
			}
		}
	];
	$scope.loading = true;
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