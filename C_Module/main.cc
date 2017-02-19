#include "datastructure.hh"

#include <iostream>
#include <iomanip>
#include <cstdlib>
#include <string>
#include <sstream>
#include <fstream>
#include <vector>
#include <chrono>
#include <tuple>
//using namespace std;


// command symbols
const char READ = 'R';
const char BUSES = 'B';
const char TIMET = 'T';
const char PRINT = 'P';
const char COUNT = 'C';
const char EMPTY = 'E';
const char QUIT = 'Q';
const char PERF = 'F';

const std::string PROMPT = "> ";
const std::string E_FNF = "Error: File not found\n";
const char FSEP = ';';

const std::string BUS = "BUS";
const std::string RADDS = "ROUTEADDSTOP";
const std::string ROUTE = "ROUTE";
const std::string STOP = "STOP";

// Helper functions
unsigned int strToUint(std::string str);
void readFile(std::string filename, Datastructure& ds );
int strToInt(std::string str);
void perfTest(Datastructure& ds, std::string cmdline, unsigned long int startmem);
std::tuple<unsigned long int,std::string> mempeak();

int main(int argc, char **argv)
{
	
	if( argc != 4){
		
		std::cout <<"ERROR"<< std::endl;
		return 0;
		
	}
	
	  std::string time = "";
	  int stop_id1 = 0;
	  int stop_id2 = 0;
	  unsigned int hours = 0;
	  unsigned int minutes = 0;	
	
	  time = argv[1];
	  stop_id1 = atoi(argv[2]);
	  stop_id2 = atoi(argv[3]);
	//std::cout << "Have " << argc << " arguments:" << std::endl;
	/*
		for (int i = 0; i < argc; ++i) {
			std::cout << argv[i] << std::endl;
		}
	*/
	
  unsigned long int startmem = std::get<0>(mempeak());
  Datastructure ds;
  // variables for command reading
  char command = QUIT;
	
	std::string filename = "zzz-final_bus_full.txt";
	readFile(filename, ds);
	//std::cout << COUNT << std::endl;
	//ds.print_statistics();
	//T 15:00 505 1017
	  //std::string time = "";
	  //int stop_id1 = 0;
	  //int stop_id2 = 0;
	  //unsigned int hours = 0;
	  //unsigned int minutes = 0;
	  //Take these things as arguments.
	  //std::cin >> time;
	  //std::cin >> stop_id1;
	  //std::cin >> stop_id2;
	  //time = "15:00";
	  //stop_id1 = 505;
	  //stop_id2 = 1017;
	

	  // split time to hours and minutes
	  hours = strToUint(time.substr(0, time.find(':')));
	  minutes = strToUint(time.substr(time.find(':')+1, std::string::npos));
      if (hours > 23 || minutes > 59)
	    {
	      std::cout << "ERROR" << std::endl;
			return 0;
	    }

	/*
      std::cout << TIMET << " " << std::setfill('0') << std::setw(2) << hours << ":"
                << std::setfill('0') << std::setw(2) << minutes
                << " " << stop_id1 << " " << stop_id2 << std::endl;
	*/
	
      ds.print_fastest_journey(stop_id1, stop_id2, hours, minutes);
	
	
/*
  do
    {
      std::cout << PROMPT;
      std::cin >> command;
      if (std::cin.eof())
	{
	  command = QUIT;
	}

      // Reading in a file
      if ( command == READ )
	{
	  std::string filename;
	  std::cin >> filename;
	  std::cout << READ << " " << filename << std::endl;
	  readFile(filename, ds);
	}

      else if ( command == BUSES )
	{
	  int stop_id = 0;
	  std::cin >> stop_id;
	  std::cout << BUSES << " " << stop_id << std::endl;
	  ds.print_buses(stop_id);
	}
      else if (command == TIMET)
	{
	  std::string time = "";
	  int stop_id1 = 0;
	  int stop_id2 = 0;
	  unsigned int hours = 0;
	  unsigned int minutes = 0;
	  std::cin >> time;
	  std::cin >> stop_id1;
	  std::cin >> stop_id2;

	  // split time to hours and minutes
	  hours = strToUint(time.substr(0, time.find(':')));
	  minutes = strToUint(time.substr(time.find(':')+1, std::string::npos));
      if (hours > 23 || minutes > 59)
	    {
	      std::cout << "error" << std::endl;
	    }

      std::cout << TIMET << " " << std::setfill('0') << std::setw(2) << hours << ":"
                << std::setfill('0') << std::setw(2) << minutes
                << " " << stop_id1 << " " << stop_id2 << std::endl;
      ds.print_fastest_journey(stop_id1, stop_id2, hours, minutes);
	}

      else if ( command == PRINT )
	{
	  int stop_id = 0;
	  std::cin >> stop_id;
	  std::cout << PRINT << " " << stop_id << std::endl;
	  ds.print_stop(stop_id);
	}
      else if ( command == COUNT )
	{
	  std::cout << COUNT << std::endl;
	  ds.print_statistics();
	}
      else if ( command == EMPTY )
	{
	  std::cout << EMPTY << std::endl;
	  ds.empty();
	}
      else if ( command == PERF )
	{
	  std::string cmdline = "";
	  std::getline(std::cin, cmdline);
	  std::cout << "F" << cmdline << std::endl;
      perfTest(ds, cmdline, startmem);
	}

    } while( command != QUIT);
	
*/	
	

  //std::cout << QUIT << std::endl;
  //std::cout <<"This program uses bus data from Tampereen kaupunkiliikenne (TKL)"<< std::endl;
  return 0;
}

unsigned int strToUint(std::string str)
{
  std::istringstream stream(str);
  unsigned int number = 0;
  stream >> number;
  return number;
}

int strToInt(std::string str)
{
  std::istringstream stream(str);
  int number = 0;
  stream >> number;
  return number;
}

void readFile(std::string filename, Datastructure& ds )
{
  std::ifstream file(filename.c_str());

  if(!file)
    {
      file.close();
      std::cout << E_FNF;
      return;
    }

  std::string cname = "";
  std::string line = "";
  while(std::getline(file,line))
    {
      std::istringstream linestream(line);
      std::getline(linestream, cname, FSEP);
      if (cname == RADDS)
	{
	  std::string temp = "";
	  int route_id = 0;
	  int stop_id = 0;
	  unsigned int minutes = 0;
	  std::getline(linestream, temp, FSEP);
	  route_id = strToInt(temp);
	  std::getline(linestream, temp, FSEP);
	  stop_id = strToInt(temp);
	  std::getline(linestream, temp);
	  minutes = strToUint(temp);
	  ds.add_stop_to_route(route_id, stop_id, minutes);
	  //std::cerr << RADDS << " " << route_id << " " << stop_id << " "
	  //<< minutes << std::endl;
	}
      else if (cname == BUS)
	{
	  std::string temp = "";
	  int bus_id = 0;
	  int route_id = 0;
	  unsigned int start_hours = 0;
	  unsigned int start_minutes = 0;
	  std::getline(linestream, temp, FSEP);
	  bus_id = strToInt(temp);
	  std::getline(linestream, temp, FSEP);
	  route_id = strToInt(temp);
	  std::getline(linestream, temp, FSEP);
	  start_hours = strToUint(temp);
	  std::getline(linestream, temp);
	  start_minutes = strToUint(temp);
	  //std::cerr << BUS << " " << bus_id << " " << route_id << " "
	  //	    << start_hours << " " << start_minutes << std::endl;
	  ds.add_bus(bus_id, route_id, start_hours, start_minutes);
	}
      else if (cname == STOP)
	{
	  std::string temp = "";
	  int stop_id = 0;
	  std::string stop_name = "";
	  std::getline(linestream, temp, FSEP);
	  stop_id = strToInt(temp);
	  std::getline(linestream, temp);
	  stop_name = temp;
	  ds.add_stop(stop_id, stop_name);
	  //std::cerr << STOP << " " << stop_id << " " << stop_name << std::endl;
	}
      else if (cname == ROUTE)
	{
	  std::string temp = "";
	  int route_id = 0;
	  std::string route_name = "";
	  std::getline(linestream, temp, FSEP);
	  route_id = strToInt(temp);
	  std::getline(linestream, temp);
	  route_name = temp;
	  ds.add_route(route_id, route_name);
	  //std::cerr << ROUTE << " " << route_id << " " << route_name
	  //	    << std::endl;
	}
      else
	{
	  continue;
	}
    }


}

std::tuple<unsigned long int,std::string> mempeak(){
    std::ifstream file_stream("/proc/self/status");
    if( file_stream ){
        std::string line;
        std::string ID;
        unsigned long int amnt;
        std::string unit;
        while( std::getline( file_stream, line ))
        {
            std::istringstream line_stream( line );
            std::getline(line_stream, ID, ':');
            if (ID == "VmPeak"){
                line_stream >> amnt;
                line_stream >> unit;
                return std::make_tuple(amnt, unit);
            }
        }
    }
    file_stream.close();
    return std::make_tuple(0, "?");
}

// USAGE: F LOOP_SIZE [START_STOP;END_STOP;HOURS:MINUTES]1..*
// Separate search units with space

struct searchUnit
{
  int start_stop;
  int end_stop;
  unsigned int hours;
  unsigned int minutes;
};

void perfTest(Datastructure& ds, std::string cmdline, unsigned long int startmem)
{
  std::string tempstr = "";
  int loopSize = 0;
  std::istringstream linestream(cmdline);
  std::string searchUnitStr = "";
  std::vector<searchUnit> units;

  linestream >> tempstr;
  loopSize = strToInt(tempstr);

  while (linestream >> searchUnitStr)
    {
//      std::cerr << searchUnitStr << std::endl;
      searchUnit temp;

      std::istringstream unitStream(searchUnitStr);
      std::getline(unitStream, tempstr, FSEP);
      temp.start_stop = strToInt(tempstr);
      std::getline(unitStream, tempstr, FSEP);
      temp.end_stop = strToInt(tempstr);
      std::getline(unitStream, tempstr, ':');
      temp.hours = strToUint(tempstr);
      std::getline(unitStream, tempstr);
      temp.minutes = strToUint(tempstr);
      units.push_back(temp);
    }

  std::chrono::time_point<std::chrono::high_resolution_clock> start, end;
  start = std::chrono::system_clock::now();

  for (int j = 0; j < loopSize; j++)
    {
      //std::cerr << "Loop" << std::endl;
      for (unsigned int i = 0; i < units.size(); i++)
        {
          /*std::cerr << "alkustop: " << units[i].start_stop << std::endl;
          std::cerr << "loppustop: " << units[i].end_stop << std::endl;
          std::cerr << "tunti: " << units[i].hours << std::endl;
          std::cerr << "minuutti: " << units[i].minutes << std::endl;*/
          ds.print_fastest_journey(units[i].start_stop, units[i].end_stop,
                       units[i].hours, units[i].minutes);
        }
    }

  end = std::chrono::system_clock::now();
  std::chrono::duration<double> elapsed = end-start;
  unsigned long int maxmem;
  std::string unit;
  std::tie(maxmem, unit) = mempeak();
  maxmem -=  startmem;
  std::cerr << elapsed.count() << " sec, " << maxmem << " " << unit << std::endl;

}
