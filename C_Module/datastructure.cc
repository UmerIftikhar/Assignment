// Definition of Datastructure class, hw3 of TIE-20100/TIE-20106

#include "datastructure.hh"
using namespace std;


Datastructure::Datastructure()
{
	counter_stops = 0;
	counter_buses = 0;
	counter_routes = 0;

}

Datastructure::~Datastructure()
{
}

void Datastructure::add_stop(int stop_id, std::string stop_name)
{
	Stop* stop = new Stop();
	stop->stop_id = stop_id;
	stop->stop_name = stop_name;
	allStops.push_back(stop);
	counter_stops += 1;
}

void Datastructure::add_route(int route_id, std::string route_name)
{
	Route* route = new Route();
	route->route_id = route_id;
	route->route_name = route_name;
	allRoutes.push_back(route);
	counter_routes += 1;
}
Route* Datastructure::findRoute(int route_id)
{
	for(size_t i = 0; i < allRoutes.size(); i++)
	{
		if(route_id == allRoutes.at(i)->route_id)
		{
			return allRoutes.at(i);
		}
	}
	return nullptr;
}
Stop* Datastructure::findStop(int stop_id)
{
	for(size_t i = 0; i < allStops.size(); i++)
	{
		if(stop_id == allStops.at(i)->stop_id)
		{
			return allStops.at(i);
		}
	}
	return nullptr;
}

void Datastructure::add_stop_to_route(int route_id, int stop_id, unsigned int minutes)
{
	Route* route = new Route();
	route = findRoute(route_id);
	if(route != nullptr)
	{
		Stop* stop = new Stop();
		stop = findStop(stop_id);
		if(stop != nullptr)
		{
			RoutePassingByStop route_by_stop;
			route_by_stop.minutes = minutes;
			route_by_stop.route = route;
			route->bus_stops.push_back(stop);
			stop->validRoutes.insert(route_by_stop);
		}
	}

}

void Datastructure::add_bus(int bus_id, int route_id, unsigned int start_hours, unsigned int start_minutes)
{
	Route* route = new Route();
	route = findRoute(route_id);
	if(route != nullptr)
	{
		Bus* bus = new Bus();
		bus->bus_id = bus_id;
		bus->start_time.hours = start_hours;
		bus->start_time.minutes = start_minutes;
		route->bus_time.push_back(bus);
	}

	counter_buses += 1;
}

void Datastructure::empty()
{
	allStops.clear();
	allRoutes.clear();
	counter_buses = 0;
	counter_routes = 0;
	counter_stops = 0;
}

void Datastructure::print_stop(int stop_id)
{
	for(size_t i = 0; i < allStops.size(); i++)
	{
		if(allStops.at(i)->stop_id == stop_id)
		{
			cout<<allStops.at(i)->stop_name<<endl;
			return;
		}
	}
	cout<<NO_SUCH_STOP<<endl;
}

void Datastructure::printStop_busRoutes(Stop* stop)
{
	for( set<RoutePassingByStop>::iterator itValidRoute = stop->validRoutes.begin(); itValidRoute != stop->validRoutes.end(); itValidRoute++)
	{
		cout<<itValidRoute->route->route_name<<endl;
	}
}
void Datastructure::print_buses(int stop_id)
{
	Stop* stop = new Stop();
	stop = findStop(stop_id);
	if(stop != nullptr)
	{
		printStop_busRoutes(stop);
	}
}

void Datastructure::print_statistics()
{
	cout<<counter_stops<<" stops, "<<counter_routes<<" routes, ";
	cout<<counter_buses<<" buses."<<endl;

}

int Datastructure::findStop_validRoutes(Route* route, int stop_id)
{
	for(size_t i = 0; i < route->bus_stops.size(); i++)
	{
		if(route->bus_stops.at(i)->stop_id == stop_id)
		{
			return i;
		}
	}
	return -1;
}

int Datastructure::find_next_bus(Time time, Route* route)
{
	for(size_t i = 0; i < route->bus_time.size(); i++ )
	{
		if(route->bus_time.at(i)->start_time >= time)
		{
			return i;
		}
	}
	return -1;
}

void Datastructure::print_fastest_journey(int start_stop, int end_stop, unsigned int hours, unsigned int minutes)
{
	Stop* start_s = new Stop();
	Stop* end_s = new Stop();
	
	for(size_t i = 0; i < allStops.size(); i++)
	{
		allStops.at(i)->status = false;
		allStops.at(i)->previous_stop = nullptr;
		allStops.at(i)->minutes = -1;
	}

	start_s = findStop(start_stop);
	end_s = findStop(end_stop);
	
	if(start_s == nullptr || end_s == nullptr)
	{
		cout<<NO_SUCH_STOP<<endl;
	}
	else
	{
		priority_queue<Stop_Timing, vector<Stop_Timing>, greater<Stop_Timing>> p_queue;
		Stop_Timing stop_time;
		Time start_time;
		start_time.minutes = minutes;
		start_time.hours = hours;
		stop_time.minutes = 0;
		stop_time.stop = start_s;
		p_queue.push(stop_time);
		bool done = false;
		
		//Dijkstra's algorithm starts
		while(!p_queue.empty() && !done)
		{
			Time actual_time;

			stop_time = p_queue.top();
			p_queue.pop();
			
			if(stop_time.stop->stop_id == end_stop)
			{
				done = true;
			}
			actual_time = start_time + stop_time.minutes;
			
			for(set<RoutePassingByStop>::iterator itValidRoute = stop_time.stop->validRoutes.begin(); itValidRoute != stop_time.stop->validRoutes.end(); itValidRoute++)
			{
				Route* route = new Route();
				int index_stop;

				route = itValidRoute->route;
				index_stop = findStop_validRoutes(route, stop_time.stop->stop_id);
				
				if(index_stop != -1)
				{
					int actual_stop_minutes;
					actual_stop_minutes = itValidRoute->minutes;
					index_stop += 1;
					
					if(index_stop <(int)route->bus_stops.size())
					{
						int index_bus;
						int next_stop_minutes;
						Time departure_time;
						Stop_Timing next_stop;
						Time bus_time;
						Time time_actual_stop;
						time_actual_stop.hours = 0;
						time_actual_stop.minutes = actual_stop_minutes;
						next_stop_minutes = route->bus_stops.at(index_stop)->validRoutes.find(*itValidRoute)->minutes;
						departure_time = to_time(actual_time - time_actual_stop);
						index_bus = find_next_bus(departure_time, route);
						
						if(index_bus != -1)
						{
							bus_time = route->bus_time.at(index_bus)->start_time + actual_stop_minutes;
							next_stop.stop = route->bus_stops.at(index_stop);
							next_stop.minutes = next_stop_minutes - actual_stop_minutes + stop_time.minutes + (bus_time - actual_time);
							
							if(route->bus_stops.at(index_stop)->minutes > next_stop.minutes || route->bus_stops.at(index_stop)->minutes == -1)
							{
								route->bus_stops.at(index_stop)->minutes = next_stop.minutes;
								route->bus_stops.at(index_stop)->previous_stop = stop_time.stop;
								p_queue.push(next_stop);
							}
						}

					}
				}
			}
			stop_time.stop->status = true;
		} //Dijkstra algorithm ends here
		
		//checks if there is a way from the given two stops
		if(done)
		{
			stack<Stop*>path_to_display;
			Stop* actual_stop = new Stop();
			actual_stop = end_s;
			
			while(actual_stop != start_s)
			{
				path_to_display.push(actual_stop);
				actual_stop = actual_stop->previous_stop;
			}

			//cout << "  " << start_time.hours << ":" << start_time.minutes << " ";
			cout<< start_time.hours << ":" << start_time.minutes << ";";
			cout<<start_s->stop_id<<";";
			cout<<start_s->stop_name<<endl;

			while(!path_to_display.empty())
			{
				Time time_at_stop;
				actual_stop = path_to_display.top();
				path_to_display.pop();

				time_at_stop = start_time + actual_stop->minutes;

				//cout << "  " << time_at_stop.hours << ":" << time_at_stop.minutes << " ";
				cout <<time_at_stop.hours << ":" << time_at_stop.minutes << ";";
				cout <<actual_stop->stop_id <<";";
				cout<<actual_stop->stop_name<<endl;
				//cout<<actual_stop->validRoutes<<endl;
			}
		}
		else
		{
			cout<<NO_ROUTE<<endl;
		}
	}

}
