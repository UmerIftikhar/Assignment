'use strict';
var app = angular.module('mainApp');
app.factory('manageAllData', function(uiGmapIsReady, uiGmapGoogleMapApi) {
	var polylineOptions = {
		strokeColor: '#C83939',
		strokeOpacity: 1,
		strokeWeight: 4
	};
	var self = this;
	self.mapInstance;
	self.currentMap;
	self.directionsDisplayArray = [];
	self.directionsServiceArray = [];
	self.polylines = [];
	self.infowindow;
	uiGmapGoogleMapApi.then(function(maps) {
		uiGmapIsReady.promise(1).then(function(instances) {
			self.mapInstance = maps;
			self.infowindow = new self.mapInstance.InfoWindow();
		});
	});
	return {
		directionsDisplayArray: self.directionsDisplayArray,
		computeAndCombineDirections: computeAndCombineDirections,
		clearMap: clearMap,
		setMap: setMap
	};

	function clearMap() {
		for (var i = 0; i < self.directionsDisplayArray.length; i++) {
			self.directionsDisplayArray[i].setMap(null);
		}
		for (var i = 0; i < self.polylines.length; i++) {
			self.polylines[i].setMap(null);
		}
	}

	function setMap(mapInstance) {
		self.currentMap = mapInstance;
	}

	function computeAndCombineDirections(inputCoordinates) {
		var latLng = inputCoordinates[0].split(',');
		var cc = {
			latitude: latLng[0],
			longitude: latLng[1]
		}
		self.currentMap.center = cc;
		var i = inputCoordinates.length;
		var index = 0;
		while (i != 0) {
			if (i <= 10) {
				var tmp_locations = [];
				for (var j = index; j < inputCoordinates.length; j++) {
					tmp_locations.push(inputCoordinates[j]);
				}
				drawRouteMap(tmp_locations);
				i = 0;
				index = inputCoordinates.length;
			} else {
				var tmp_locations = [];
				for (var j = index; j < index + 10; j++) {
					tmp_locations.push(inputCoordinates[j]);
				}
				drawRouteMap(tmp_locations);
				i = i - 9;
				index = index + 9;
			}
		}
	}

	function drawRouteMap(locationsToPlot) {
		var start, end;
		var waypts = [];
		if (locationsToPlot.length > 2) {
			start = locationsToPlot[0];
			end = locationsToPlot[locationsToPlot.length - 1];
		}
		for (var k = 1; k < locationsToPlot.length - 1; k++) {
			waypts.push({
				location: locationsToPlot[k],
				stopover: true
			});
		}
		var request = {
			origin: start,
			destination: end,
			waypoints: waypts,
			optimizeWaypoints: true,
			travelMode: self.mapInstance.TravelMode['DRIVING']
		};
		self.directionsServiceArray.push(new self.mapInstance.DirectionsService());
		var instance = self.directionsServiceArray.length - 1;
		self.directionsDisplayArray.push(new self.mapInstance.DirectionsRenderer({
			preserveViewport: true,
			suppressPolylines: true
		}));
		self.directionsDisplayArray[instance].setMap(self.currentMap.control.getGMap());
		self.directionsServiceArray[instance].route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				//Add the function to create PolyLines.
				var legs = response.routes[0].legs;
				createPloyLinesForRoute(legs);
				self.directionsDisplayArray[instance].setDirections(response);
			}
		});
	}
	//Since there is no click event on the DirectionsRenderer, therefore add PolyLines on the specified route.
	//Then add click event to those routes, so I could add Distance and Time accordingly.
	//https://developers.google.com/maps/documentation/javascript/reference#DirectionsRenderer
	function createPloyLinesForRoute(legs) {
		var directionsForPath = [];
		for (var i = 0; i < legs.length; i++) {

			var steps = legs[i].steps;
			var distanceCalc = legs[i].distance;
			var dist = distanceCalc.text;
			var singleStopDirection = [];
			for (var j = 0; j < steps.length; j++) {
				var nextSegment = steps[j].path;
				var instructions = steps[j].instructions;
				singleStopDirection.push(instructions);
				//console.log(instructions);
				var stepPolyline = new self.mapInstance.Polyline(polylineOptions);
				for (var k = 0; k < nextSegment.length; k++) {
					stepPolyline.getPath().push(nextSegment[k]);
				}
				stepPolyline.setMap(self.currentMap.control.getGMap());
				self.polylines.push(stepPolyline);
				//IIFE.
				(function(dist) {
					self.mapInstance.event.addListener(stepPolyline, 'click', function(evt) {
						self.infowindow.setContent("<a>Distance To Next Stop</a>: <br>" + dist);
						self.infowindow.setPosition(evt.latLng);
						self.infowindow.open(self.currentMap.control.getGMap());
					});
				}(dist));
			}

			directionsForPath.push(singleStopDirection);
		}

	}
});
