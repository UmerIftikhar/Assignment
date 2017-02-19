# Install the Modules:

1.  -- npm install.
2.  -- bower install.



# Start the Server:
npm start


# Access the Client:
http://localhost:8080


#Demonstration:  
https://www.youtube.com/watch?v=-Kq4IX7R3NQ&feature=youtu.be


# Test Swap Button:
Stops:  
1-- stopName:  Keskustori M, stopId: 0001  
2-- stopName:  Hervantakeskus, stopId: 3642  

# Other Working Stops:
1-- stopName:  Aleksis Kiven katu, stopId: 0070  
2-- stopName:  Lapinniemen kylpylä, stopId: 5018  



# Working:
1-- When the page is loaded, function updateAllBuses() is called from the controller "manageStops".  
2-- updateAllBuses() calls the $interval(function(){ updateTheData(); }, 2500), where updateTheData() updates the position of every individual bus every 2.5 seconds.  
3-- loadAll() is also called from the controller SearchCtrl on page load. It get all the stops Names and Ids from the Nodejs Server. Later, the data is used for search purposes.  
4-- querySearch() is used to filter out the data as the user types the input stops in the search fields.  
5-- search() from the controller SearchCtrl is called when the user clicks the SEARCH button. retrieveShortestRoute.js file is used to make queries to find shortest path from the server.  
6-- Once the Path is retrieved, service.js file is used to plot all the bus stops and paths from the retrieved data.  
7-- reset() function clear all the form data and errors and also remove all paths and directions from the Map.  


# CONTOLLER and Javascript Files  

/////////////////////////////////  
##  Javascript File: main.js  
/////////////////////////////////  

## CONTROLLER NAME: manageStops  

### Function Name: updateAllBuses()  
Description: Get called when page is Loaded.  
It further calls the Function updateTheData() and set Interval of 2.5 seconds on this function.  


### Function Name: updateTheData()  
Description: Get called when page is Loaded, from the function updateAllBuses().  
This function is executed after every 2.5 seconds to keep track of the buses and their movement.  

## CONTROLLER NAME: AppCtrl  

### Function Name: openSideNavPanel()  
Description: Used to open the left side menu.  


### Function Name: closeSideNavPanel()  
Description: Used to close the left side menu.  


## CONTROLLER NAME: SearchCtrl  

### Function Name: updateToolTip()  
Description: Used to change the value of self.turnDirection to either "Turn On" or "Turn Off".  

### Function Name: querySearch()  
Description: Filters the data according to the input typed by the user in the search field for Bus stops.  


### Function Name: showToast()  
Description: When a route is not found, a toast is displayed for 3 seconds from the bottom of the screen, displaying that no route Found.  

### Function Name: swapSearch()  
Description: Swaps the value of the Start and End stops and calls the search() function again.  

### Function Name: search()  
Description: Sends three parameter to server: [time,startStop,endStop].The retrieveRoute is used to further plot the directions or Routes on the Map.  

### Function Name: clearRoute()  
Description: It clears the markers and routes from the Map.  

### Function Name: reset()  
Description: It clears the markers and routes from the Map.  


/////////////////////////////////  
##  Javascript File: service.js  
/////////////////////////////////
### Function Name: computeAndCombineDirections()  
Description: It checks whether the number of coordinates are greater than 10 or not, if they are then it plots more than one route. (Since google MAP API doesnot allow more than 8 waypoints for showing diectons). Then this function further calls the drawRouteMap() function which calls the direction Service of goggle Maps API and retrive the PATH. But GOOGLE doesnot allow the CLICK event on the route. Therefore, we further call the createPloyLinesForRoute() function to create lines on the Retrieved Route from API, and attach the click event to those lines.  

### Function Name: drawRouteMap()  
Description: It calls the DirectionsService  and retrieves the routes for the specified waypoints.  

### Function Name: createPloyLinesForRoute()  
Description: It calls the Polyline()  and create the lines on the routes obtained from the drawRouteMap() function. It then attaches the click event to these lines. An InfoWindow is opened which shows the distance between two stops.  


/////////////////////////////////  
##  Javascript File: busLocation.js  
/////////////////////////////////
### Function Name: generateMarkers()  
Description: It calls the Tampere API and retrieves the latest data for each bus. It then generates a marker for each bus and sets the bus icon(Image). It also stores further data such as bus speed and bearing.  

### Function Name: updateMarkers()  
Description: It calls the Tampere API and retrieves the latest data for each bus. Instead of creating new markers, it simply updates the data corresponding to each bus.  



/////////////////////////////////  
##  Javascript File: retrieveShortestRoute.js  
/////////////////////////////////
### Function Name: RouteDataService()  
Description: It returns the Route calculated by using the server.  



/////////////////////////////////  
##  Javascript File: retrieveAllStops.js  
/////////////////////////////////
### Function Name: StopDataService()  
Description: It returns all the Stop Names and IDs.    
