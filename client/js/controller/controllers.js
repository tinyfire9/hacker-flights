app.controller("hackathonsListController" , ['$scope', '$resource', '$window',
	function($scope, $resource, $window)
	{
		$scope.displayHackathons = function(){
			var Hackathons = new $resource('/hackathons/' + $scope.airportLocation);
			$scope.hackathons = Hackathons.query(function(data){
					//console.log(data);
					if(!data)
					{
						$scope.hackathons = "Invalid airport location :(";
						$window.location.href = "/";
					}
					else
					{
						$scope.hackathons = data;
					}
				});
		}
	}
]);

