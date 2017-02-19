-'use strict';
var app = angular.module('mainApp', ['ngMaterial', 'ngMessages', 'material.svgAssetsCache', 'mdPickers', 'ngSanitize', 'ui.select', 'uiGmapgoogle-maps', 'ngAnimate', 'ui.bootstrap']);
//http://stackoverflow.com/questions/27641953/google-maps-waypoints-more-than-8-issue
/*
Files to be deleted:
readMap.js
mapService.js
*/
/*
TODO:
Create an Angular Directive to check if the Input Stops are equal or not, and disable the search button.
*/
/*
**********************================================================***************************
                            Script: service.js
**********************================================================***************************
Service Name: manageAllData
Functionality: It uses google Maps Api to draw the Route provided by the user in the form of latitudes and longitudes.
This has two Functions:
1) computeDirection:
It takes coordinates of origin stop, destination stop, all the other stops that lies in the Route.

2) clearMap:
This function is called to clear the previous route from the Maps.
**********************================================================***************************

**********************================================================**************************
*/
//Used for sliding the Search Menu.
app.controller('AppCtrl', function($scope, $mdSidenav) {
	$scope.showSidePanel = true;
	$scope.showMobileMainHeader = true;
	$scope.openSideNavPanel = function() {
		$mdSidenav('left').open();
	};
	$scope.closeSideNavPanel = function() {
		$scope.showSidePanel = false;
		$mdSidenav('left').close();
	};
});
//register themes:
app.config(function($mdThemingProvider) {
	$mdThemingProvider.theme('error-toast')
});
app.controller('SearchCtrl', function($scope, $timeout, $q, $mdpDatePicker, $mdpTimePicker, $mdToast, retrieveStopData, retrieveRoute, manageAllData) {
	var self = this;
	var imagePath = 'images/displayBus1.png';
	var timeImage = 'images/time_bus.png';
	var arrowImage = 'images/arrow.png';
	self.showDirections = true;
	self.arrowImage = 'images/arrow.png';
	self.imagePath = 'images/displayBus1.png';
	self.timeImage = 'images/time_bus.png';
	self.turnDirection = "Turn Off";
	self.showDirectionData = [];
	//var self = this;
	self.startPoint = null;
	self.endPoint = null;
	//self.states        = loadAll();
	self.selectedItem = null;
	//self.searchText    = null;
	self.searchStart = null;
	self.searchEnd = null;
	self.querySearch = querySearch;
	self.search = search;
	self.reset = reset;
	self.swapSearch = swapSearch;
	self.currentTime = new Date();
	self.isMatch = false;
	self.description = "HELLO";
	self.updateToolTip = function(showDirections) {
		if (showDirections) {
			self.turnDirection = "Turn Off";
		} else {
			self.turnDirection = "Turn On";
		}
	}

	function querySearch(query) {
		var results = query ? self.states.filter(createFilterFor(query)) : self.states;
		var deferred = $q.defer();
		//Add a delay of 500 ms, to give EFFECTS.
		$timeout(function() {
			deferred.resolve(results);
		}, Math.random() * 500, false);
		return deferred.promise;
	}

	function showToast(message) {
		//Set a theme in app.config.
		//Theme for error message, in case route is not found.
		$mdToast.show($mdToast.simple().textContent(message).theme('error-toast').hideDelay(3000));
	};


	function swapSearch(projectForm) {
		//First Clear The Route.
		//Then Swap the Bus stops.
		//Call the search Function with these parameters.
		clearRoute();
		var swap_1 = self.startPoint;
		self.startPoint = self.endPoint;
		self.endPoint = swap_1;
		var swap = self.searchStart;
		self.searchStart = self.searchEnd;
		self.searchEnd = swap;
		self.search();
	}
	//var directions = manageAllData.directionsDisplayArray[0].getDirections();
	// var legs = directions.routes[0].legs;
	//var duration = directions.routes[0].legs[0].duration.text;
	//var distance = directions.routes[0].legs[0].distance.text;
	function search() {
		clearRoute();
		//console.log("SEARCH BUTTON CLICKED");
		//Name of the Stops could be the same, but Ids must be different. Since, there exists stops which have same name but different Ids.
		//if(self.searchStart !== 'undefined' && self.searchEnd !== 'undefined' && ( self.searchStart!==self.searchEnd ) ){
		if (self.searchStart !== 'undefined' && self.searchEnd !== 'undefined' && (self.startPoint.id !== self.endPoint.id)) {
			var time = self.currentTime.getHours() + ':' + self.currentTime.getMinutes();
			//console.log(time);
			retrieveRoute.RouteDataService(time, self.startPoint.id, self.endPoint.id).then(function(response) {
				//RECIEVED
				//{time: "5:26", stopName: "Aleksis Kiven katu", stopID: "0070", location: "61.49892,23.75971", stopover: true}
				//EXPECTED
				//{ location: '61.46222,24.07238', stopover: true }
				self.showDirectionData = response.data;
				//console.log(response.data);
				//If a Route Exists, proceed with creating and displaying it.
				console.log(self.showDirectionData.length);
				if (response.data.length > 0) {
					var inputCoordinates = [];
					var myInputCoordinates = []; //To be deleted Later.
					//Fetch the relevant data to show to the user, since Latitude and Longitudes exists and user have no concern with them.
					for (var key in response.data) {
						if (response.data.hasOwnProperty(key)) {
							//console.log(key);
							myInputCoordinates.push(response.data[key].location);
						}
					}
					manageAllData.computeAndCombineDirections(myInputCoordinates);
				} else {
					//console.log("No Route Exists");
					showToast('NO ROUTE FOUND!'); //Show a Red Highlighted Messsag, that a Route was not found.
				}
			});
			//console.log(self.states);
		} else {
			showToast("Start & End Stops Can not be same!");
		}
	}

	function clearRoute() {
		if (manageAllData.directionsDisplay != 'undefined') {
			manageAllData.clearMap(); //Clear the Route.
		}
		if (manageAllData.directionsDisplayArray != 'undefined') {
			manageAllData.clearMap(); //Clear the Route.
		}
	}

	function reset(formToReset) {
		//formToReset.$rollbackViewValue();
		//formToReset.$setPristine();
		formToReset.$setUntouched();
		//console.log(formToReset);
		self.searchStart = '';
		self.searchEnd = '';
		self.showDirectionData = [];
		clearRoute();
		/*
		if(manageAllData.directionsDisplay != 'undefined'){
				manageAllData.clearMap();	//Clear the Route.
		}
		*/
	}
	self.loadAll = function() {
		retrieveStopData.StopDataService().then(function(response) {
			self.states = response.data;
		});
	}

	function createFilterFor(query) {
		var lowercaseQuery = angular.lowercase(query);
		return function filterFn(state) {
			var busStop = angular.lowercase(state.name);
			return (busStop.indexOf(lowercaseQuery) === 0);
		};
	}
});

app.controller('manageStops', function($scope, $http, $timeout, $interval, manageAllData, getBusData, retrieveStopData) {
	//Working
	var vm = this;
	vm.loadBuses = true; //Only Load the Buses Once(Instantiate the MARKERS only once).
	vm.loadingData = false;
	vm.map = {
		control: {},
		center: {
			latitude: 61.446363,
			longitude: 23.852663
		},
		zoom: 15
	};
	vm.markers = [];
	vm.window = {
		marker: {},
		show: false,
		closeClick: function() {
			this.show = false;
		},
		options: {}
	};
	vm.markersEvents = {
		click: function(marker, eventName, model) {

			//console.log(marker);
			//console.log('Click marker');
			vm.window.model = model;
			vm.window.show = true;
		}
	};
	/*
	IMPORTANT TO REMEMBER:
	Only Create MARKERS for buses once the application is loaded.
	Get Update after every 10 seconds and only change the position of each MARKER.
	If MARKERS are re-initialized, it will consume much greater time.(STRONGLY FORBIDDEN TO USE)
	Therefore, just update the coordinates(Latitude and Longitude) of each Marker.

	How to know which coordinates(received from http Request) correspond to which MARKER???????
	IMPORTNT:
	When Markers are loaded for the first time, declare a KEY by the name of "id".
	Assign it a value of "vehicleRef" which would be some thing like this: "TKL_66".


	=> FORMAT for storing MARKER data.

	setMarker = {
	  "id": vehicleRef,   => Unique vehicleRef for each BUS.
	  "coords": {
	    "latitude": latitude,
	    "longitude": longitude
	  },
	  icon: {
	    url:"../../public/images/bus.png",
	    scaledSize: { width: 30, height: 30 }
	  }

	}

	=> IMPORTANT:
	As mentioned in the document:
	<ui-gmap-markers> for multiple MARKERS improves the performance.
	<ui-gmap-marker> is not recommended to be used with large number of markers.
	<!--
	              <ui-gmap-marker ng-repeat="m in ctrl.markers" coords="m.coords" icon="m.icon" idkey="m.id">
	              </ui-gmap-marker>
	-->
	              <ui-gmap-markers models="ctrl.markers" coords="'coords'" icon="'icon'" modelsbyref="false"/>


	*/
	vm.updateTheData = function() {
		//IMPORANT:
		//Arrays are passed by reference in javascript, so if vm.markers is changed in BusLocationService,
		//it will automatically change here.
		//STRONGLY FORBIDDEN:
		//Donot use the assign(=) operator on vm.markers in BusLocationService, as we will loose refernce to it.
		getBusData.BusLocationService().then(function(response) {
			var getCurrentBusesLocation = response.data.body;
			if (vm.loadBuses) {
				getBusData.generateMarkers(getCurrentBusesLocation, vm.markers);
				vm.loadBuses = false;
			} else {
				getBusData.updateMarkers(getCurrentBusesLocation, vm.markers);
			}
		});
	}
	vm.updateAllBuses = function() {
		//Get the Instance of the Map to Work on, and sahre it using the service.
		$timeout(function() {
			manageAllData.setMap(vm.map);
		}, 1000);
		vm.updateTheData();
		$interval(function() {
			vm.updateTheData();
		}, 500);
	}
});
