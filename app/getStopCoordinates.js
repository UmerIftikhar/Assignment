var fs = require('fs');
var fileToRead = "./C_Module/location_stops_coordinates.txt";
module.exports = function (sendDataToClient, busData) {

		return new Promise(function(resolve, reject){

				fs.readFile(fileToRead, 'utf8', function(err, contents) {
					if(err){
						reject(err);
					}
					
					readCoordinatesData(contents, sendDataToClient, busData);
					resolve('READ');
				});
			
		
		});	
	
}


function readCoordinatesData(stopsData, sendDataToClient, busData){

	var allStops = stopsData.split('\r\n');
	for(var i=0;i<allStops.length;i++){

		var oneStop = allStops[i];
		oneStop = oneStop.split(";");
		var stopID = oneStop[0];
		var stopName = oneStop[1];
		var coordinates = oneStop[2];
		var lat = coordinates.split(",");
		var currStop  = {
		"name": stopName,
		"id": stopID,
		"coords": {
			"latitude": lat[0],
			"longitude": lat[1]
			}

		};

		var stopToAdd = {
				"name": stopName,
				"id": stopID
		};

		busData[stopID] = currStop;
		sendDataToClient.push(stopToAdd);
	}	
	
}
