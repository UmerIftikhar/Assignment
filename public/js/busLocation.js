'use strict';
//https://docs.angularjs.org/api/ng/service/$q
/*
From the perspective of dealing with error handling, deferred and promise APIs are to asynchronous
programming what try, catch and throw keywords are to synchronous programming.
*/
var app = angular.module('mainApp');
app.factory('getBusData', function($q, $http) {
	var busLoactionsUrl = "http://data.itsfactory.fi/journeys/api/1/vehicle-activity";
	return {
		BusLocationService: BusLocationService,
		generateMarkers: generateMarkers,
		updateMarkers: updateMarkers
	};

	function BusLocationService() {
		//markersArray.length = 0; //=> REMEMBER, instead of using markersArray = [], use markersArray.length = 0;
		var deferred = $q.defer(); //initiating promise
		$http.get(busLoactionsUrl).then(function(result) {
			deferred.resolve(result);
		}, function(error) {
			deferred.reject(error);
		});
		//notify(value) => No need to include this one.
		return deferred.promise;
	};

	function generateMarkers(allBuses, markersArray) {
		allBuses.map(function(bus) {
			markersArray.push({
				id: bus.monitoredVehicleJourney.vehicleRef,
				coords: {
					"latitude": bus.monitoredVehicleJourney.vehicleLocation.latitude,
					"longitude": bus.monitoredVehicleJourney.vehicleLocation.longitude
				},
				icon: {
					path: 'M25.432,25.889c-0.882,3.419-0.314,6.74,0.131,9.789l1.394,1.536c0.011-0.06,0.021-0.119,0.029-0.181c-0.82-3.025,0.041-6.394,2.521-8.646c1.658-1.504,3.74-2.244,5.815-2.239c2.075-0.005,4.157,0.734,5.816,2.239c2.478,2.253,3.34,5.621,2.518,8.646c0.01,0.061,0.02,0.121,0.029,0.18l1.396-1.535c0.443-3.034,1.018-6.34,0.142-9.742c-1.838-7.152-6.812-14.732-9.901-21.116l0,0C32.239,11.19,27.276,18.749,25.432,25.889z',
					scale: 0.7,
					fillColor: '#6495ED',
					strokeColor: '#000000',
					fillOpacity: 1,
					rotation: parseInt(bus.monitoredVehicleJourney.bearing)
				},
				speed: bus.monitoredVehicleJourney.speed,
				bearing: bus.monitoredVehicleJourney.bearing,
				busNo: bus.monitoredVehicleJourney.journeyPatternRef,
				busId: bus.monitoredVehicleJourney.vehicleRef,
				directionRef: bus.monitoredVehicleJourney.directionRef
			});
		});
	}

	function updateMarkers(allBuses, markersArray) {
		for (var i = 0; i < allBuses.length; i++) {
			var vehicleRef = allBuses[i].monitoredVehicleJourney.vehicleRef;
			for (var j = 0; j < markersArray.length; j++) {
				if (markersArray[j].id == vehicleRef) {
					markersArray[j].coords.latitude = allBuses[i].monitoredVehicleJourney.vehicleLocation.latitude;
					markersArray[j].coords.longitude = allBuses[i].monitoredVehicleJourney.vehicleLocation.longitude;
					markersArray[j].speed = allBuses[i].monitoredVehicleJourney.speed;
					markersArray[j].bearing = allBuses[i].monitoredVehicleJourney.bearing;
					markersArray[j].directionRef = allBuses[i].monitoredVehicleJourney.directionRef;
					markersArray[j].icon.rotation = parseInt(allBuses[i].monitoredVehicleJourney.bearing);
				}
			}
		}
	}
});