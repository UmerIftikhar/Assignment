const execFile = require('child_process').execFile;

module.exports = function (requestTime, requestStartPoint, requestEndPoint, busData) {

		return new Promise(function(resolve, reject){
				
				var sendRoute = [];
				const child = execFile('./C_Module/hello',[requestTime,requestStartPoint,requestEndPoint] ,(error, stdout, stderr) => {

					    if (error) {
						  reject(error);
					    }

					    var count = 0;
					    var lines = stdout.split('\r\n'); 
					    var stopNotFound = false;
						for(var i=0;i<lines.length - 1;i++){
									var details = lines[i].split(';');
									var time = details[0];
									var stopID = details[1];				//Remember to correct the StopIDS.
									//Since the StopIDs are not returned from the C++ module in the way we want, therefore we need to addd
									//zeros to make it in the specific format. e.g: C++ module give StopID = 70 instead of 0070.
									var len = stopID.length;
									var zerosToAdd = 4 - len;
									var allZeros='';
									for(var j=0;j<zerosToAdd;j++){
										allZeros = allZeros + '0';
									}
									stopID = allZeros + stopID;
									//Check whether there is an Old Stop in the Route, if there is we should return No Route.
									if( !busData.hasOwnProperty(stopID) ){
												stopNotFound = true;
												break;
									}
									var stopName = details[2];
									var lat = busData[stopID].coords.latitude;
									var long = busData[stopID].coords.longitude;

								  var singleStopData = {
										"time": time,
										"stopName": stopName,
										"stopID": stopID,
										"location": lat+','+long,
										"stopover": true
								  };

								  sendRoute.push(singleStopData);

						}				
					
						if(stopNotFound){
								sendRoute = [];
						}					
						
						resolve(sendRoute);

				});			

		
		});	
	
}

