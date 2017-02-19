var express = require("express");
var app = express();

var port = 8080 || process.env.PORT;
app.use(express.static(__dirname+'/src/views'));
app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/images', express.static(__dirname + '/public/images'));
app.use('/lib', express.static(__dirname + '/bower_components'));
var getRoute = require('./app/getRoute.js');
var readStopsCoordinates = require('./app/getStopCoordinates.js');

//When clients page loads, send data for search options.(contains Stop Names and IDs)
var sendDataToClient = [];
//It will contain the coordinates of all the stops.
//Since the keys are StopIds, when C++ module returns ROUTE to us, we will simply get the coordinates for each stop from busData.
var busData = {};

/*
	Since Array and Object are sent by reference, they donot behave the way a normal variable will.
	Therefore, there is no need to get the data returned in the promise, since we have updated the sendDataToClient Array and
	busData Object in the getStopCoordinates.js File. We can now access the updated values here in the main File.
	File is read Asynchoronously, therefore not disturbing/blocking the main thread.
	=> This logic of reading the Stop Coordinates from the file, could be moved to DataBase, from where we can read the data
	in the similar fashion, but for the time being its read from the text file.
	NOTE: In getStopCoordinates.js File, do not use the assign operator with the sendDataToClient and busData, else we will loose the reference to them.
*/

readStopsCoordinates(sendDataToClient,busData).then(function(data){
			//Data has been read successfully.
}, function(err){
			//Admin must be informed, as this data is the back bone of the application.
});	

app.get('/dataForSearch',function(req,res){
	//File in index.html will be sent to the user.
	res.send(sendDataToClient);

});

//Move the logic to an external file and return a promise to the main handler.
//REST can also be sent to a different file, and use module.export.
app.get('/getShortestRoute',function(req,res){

	var params = req.query;
	var numberOfParams = Object.keys(req.query).length; //Have a check, must be greater than 3.
	var sendRoute = [];
	//{ location: '61.46381,24.06823', stopover: true },
	var requestTime = req.query["time"];
	var requestStartPoint = req.query["startPoint"];
	var requestEndPoint = req.query["endPoint"];

	if(requestTime == undefined || requestStartPoint == undefined   || requestEndPoint == undefined ){
			res.send([]);
	}
	else{
			getRoute(requestTime,requestStartPoint,requestEndPoint,busData).then(function(data){
				res.send(data);
			}, function(err){
				res.send([]);
			});		
		
	}

});

app.get('/',function(req,res){
	//File in index.html will be sent to the user.
	res.send('HELLO WORLD Changed');

});


app.listen(port,function(err){
	console.log('The server is running on port: '+ port);
});
