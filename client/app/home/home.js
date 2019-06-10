class Token {
	LOCAL_STORAGE_TOKEN_KEY = 'hacker_flights_places_token'
	getTokenFromLocalStorage = () => {
		let token = localStorage.getItem(this.LOCAL_STORAGE_TOKEN_KEY);
		if (!token) {
			token = window.createUUID();
			localStorage.setItem(this.LOCAL_STORAGE_TOKEN_KEY, token);
		}

		return token;
	}
	
	removeTokenFromLocalStorage = () => {
		localStorage.removeItem(this.LOCAL_STORAGE_TOKEN_KEY);
		console.log(`Token removed: ${localStorage.getItem(this.LOCAL_STORAGE_TOKEN_KEY)}`);
	}
}

const tokenInstance = new Token();

angular.module('hackerFlights.home', [])
	.config(function($stateProvider){
		$stateProvider.state('home', {
			url : '/',
			templateUrl : '/app/home/home.html',
			controller : 'homeController'
		});
	})
	.controller('homeController', function($scope, $location){
		class RowOptions {
			rowOptionOnClick = (place) => {
				return () => {
					tokenInstance.removeTokenFromLocalStorage();
					const dropdownElement = document.getElementsByClassName('autocomplete')[0];
					const searchButtom = document.getElementById('search-button');
					const inputBox = document.getElementById('input-box');

					$scope.airportLocation = place;
					inputBox.value = place;
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
		const { populateAutocompletePlaces } = new RowOptions();
		socket.on('hackerFlights.placesAutoComplete', ({ places }) => {
			populateAutocompletePlaces(places)
		});

		$scope.listAutocompletePlaces = function() {
			socket.emit('hackerFlights.listAutocompletePlaces', {
				input: $scope.airportLocation,
				token: tokenInstance.getTokenFromLocalStorage(),
			});
		}

		$scope.listPrices = function(airportLocation){
			$location.path('/hackathons/' + airportLocation);
		}
	});