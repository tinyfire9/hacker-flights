class RowOptions {
	rowOptionOnClick = (place) => {
		return () => {
			const dropdownElement = document.getElementsByClassName('autocomplete')[0];
			const searchButtom = document.getElementById('search-button');
			
			document.getElementById('input-box').value = place;
			searchButtom.disabled = false;
			dropdownElement.hidden = true;
			this.removeRowOptions(dropdownElement);
		}
	};
	
	createRowOption = (place) => {
		const rowOption = document.createElement('DIV');
	
		rowOption.onclick = this.rowOptionOnClick(place);
		rowOption.innerText = place;
		rowOption.onmouseover = () => {
			rowOption.style.backgroundColor = '#9dfcc9';
		}
		rowOption.onmouseleave = () => {
			rowOption.style.backgroundColor = '#fff';
		}
	
		return rowOption;
	};

	removeRowOptions = (dropdownElement) => {
		while(dropdownElement.firstChild) {
			dropdownElement.removeChild(dropdownElement.firstChild);
		}
	}

	populateAutocompletePlaces = (places) => {
		const dropdownElement = document.getElementsByClassName('autocomplete')[0];
		const searchButtom = document.getElementById('search-button');
		searchButtom.disabled = true;
		this.removeRowOptions(dropdownElement);

		if( places.length === 0 ) {
			dropdownElement.hidden = true;

		} else {
			dropdownElement.hidden = false;
			places.forEach((place) => {
				dropdownElement.append(this.createRowOption(place));
			});
		}
	}
}

angular.module('hackerFlights.home', [])
	.config(function($stateProvider){
		$stateProvider.state('home', {
			url : '/',
			templateUrl : '/app/home/home.html',
			controller : 'homeController'
		});
	})
	.controller('homeController', function($scope, $location){
		const { populateAutocompletePlaces } = new RowOptions();
		socket.on('hackerFlights.placesAutoComplete', ({ places }) => {
			populateAutocompletePlaces(places)
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