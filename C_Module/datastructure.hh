// Definition of Datastructure class, hw3 of TIE-20100/TIE-20106

#ifndef DATASTRUCTURE_HH
#define DATASTRUCTURE_HH

#include <queue>
#include <string>
#include <iostream>
#include <vector>
#include <set>
#include <stack>

const std::string NO_ROUTE = "Error: No route!";
const std::string NO_SUCH_STOP = "Error: No such stop!";

struct Route;
struct RoutePassingByStop
{
	Route* route;
	int minutes;
};
struct Stop
{
	int stop_id;
	std::string stop_name;
	std::vector<Stop*>stops;
	std::set<RoutePassingByStop>validRoutes;
	bool status;
	Stop* previous_stop;
	int minutes;
};
struct Time
{
	unsigned int hours;
	unsigned int minutes;
};
struct Bus
{
	int bus_id;
	Time start_time;
};

struct Route
{
	int route_id;
	std::string route_name;
	std::vector<Stop*>bus_stops;
	std::vector<Bus*>bus_time;
};
struct Stop_Timing
{
        int minutes;
	Stop* stop;
};

inline bool operator>(const Stop_Timing &first, const Stop_Timing &second)
{
	return first.minutes > second.minutes;
}
inline Time operator+(const Time &first, const int &minutes)
{
	Time result;
	result = first;
	result.minutes += minutes;
	result.hours += result.minutes/60;
	result.minutes = result.minutes%60;
	return result;
}
inline bool operator >=(const Time &time1, const Time &time2)
{
	if( time1.hours == time2.hours)
	{
		return time1.minutes >= time2.minutes;
	}
	else
	{
		return time1.hours >= time2.hours;
	}
}
inline bool operator<(const RoutePassingByStop &first_route, const RoutePassingByStop &second_route)
{
	return first_route.route->route_id < second_route.route->route_id;
}
inline int operator-(const Time &first, const Time &second)
{
	int minutes_first;
	int minutes_second;
	minutes_first = first.hours*60 + first.minutes;
	minutes_second = second.hours*60 + second.minutes;
	return minutes_first - minutes_second;

}
inline Time to_time(const int &minutes)
{
	Time time;
	time.minutes = minutes % 60;
	time.hours = minutes / 60;
	return time;
}

class Datastructure
{
public:
	Datastructure();

	~Datastructure();

	// Add a new bus stop
	void add_stop(int stop_id, std::string stop_name);

	// Add a new bus route
	void add_route(int route_id, std::string route_name);

	// Add a new stop to a route (both the route and the stop have already been added
	// using add_route and add_stop)
	void add_stop_to_route(int route_id, int stop_id, unsigned int minutes);

	// Add a new bus driving a route (the route has already been added using add_route) leaving at a certain
	// time from the terminus (first stop on route)
	void add_bus(int bus_id, int route_id, unsigned int start_hours, unsigned int start_minutes);

	// Empty the datastructure
	void empty();

	// Print information on a bus stop
	void print_stop(int stop_id);

	// Print buses leaving from a stop
	void print_buses(int stop_id);

	// Print the number of stops, bus routes, and buses
	void print_statistics();

	// Print out the fastest journey leaving from stop start_stop to stop end_stop. Journey starts at the given time
	// and the whole journey must be done within the same day (before midnight).
	void print_fastest_journey(int start_stop, int end_stop, unsigned int hours, unsigned int minutes);

	// Copy constructor is forbidden
	Datastructure(const Datastructure&) = delete;
	// Assignment operator is forbidden
	Datastructure& operator=(const Datastructure&) = delete;

private:

	// Add your own implementation here

	std::vector<Stop*>allStops;
	std::vector<Route*>allRoutes;
	unsigned int counter_buses;
	unsigned int counter_routes;
	unsigned int counter_stops;
	
	//find if the route exists
	Route* findRoute(int route_id);
	
	//find if the stop exists
	Stop* findStop(int stop_id);
	
	//sort the valid routes at a stop
	void validRoutes_ascendingSort(Stop* stop);
	
	//prints the bus routes at a stop
	void printStop_busRoutes(Stop* stop);
	
	//find index of the stop on a route
	int findStop_validRoutes(Route* route, int stop_id);
	
	//find the next bus after the given time on a given route
	int find_next_bus(Time time, Route* route);


};

#endif // DATASTRUCTURE_HH
