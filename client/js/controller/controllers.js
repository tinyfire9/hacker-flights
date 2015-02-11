app.controller("myCtrl" , ['$scope', '$resource', 
	function($scope, $resource){
		var Hackathons = new $resource('/hackathons');

		$scope.diplayHackathons = function(){
			Hackathons.query(function(data){
				console.log("Clinetside req made~");
				console.log(data);
				$scope.hackathons = data;
			});
		}
	}
]);