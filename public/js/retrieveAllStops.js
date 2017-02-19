'use strict';
//https://docs.angularjs.org/api/ng/service/$q
/*
From the perspective of dealing with error handling, deferred and promise APIs are to asynchronous
programming what try, catch and throw keywords are to synchronous programming.
*/
var app = angular.module('mainApp');
app.factory('retrieveStopData', function($q, $http) {
	var stopDataUrl = "http://localhost:8080/dataForSearch";
	return {
		StopDataService: StopDataService
	};

	function StopDataService() {
		//markersArray.length = 0; //=> REMEMBER, instead of using markersArray = [], use markersArray.length = 0;
		var deferred = $q.defer(); //initiating promise
		$http.get(stopDataUrl).then(function(result) {
			deferred.resolve(result);
		}, function(error) {
			deferred.reject(error);
		});
		//notify(value) => No need to include this one.
		return deferred.promise;
	};
});
