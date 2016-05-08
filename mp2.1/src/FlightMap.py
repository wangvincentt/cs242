from src.FlightRoutine import FlightRoutine
import sys
import json
import webbrowser
from src.City import City
from Queue import *
__author__ = "jwang135"


class FlightMap:

    '''
        Default constructor for FlightMap
        flight_distance stores all the distances given (departure,arrival)
    '''
    def __init__(self,filename):

        self.flight_distance = {}
        self.city = {}
        self.city_num = 0
        self.pop_sum = 0.0;
        self.dist_sum = 0.0
        self.route_sum = 0.0
        with open(filename,'r') as src:
            data = json.load(src)
            src.close()

        self.continents = {}
        self.source = data['data sources']
        self.metros = data['metros']
        self.routes = data['routes']
        
        for city in self.metros:
            self.add_city(city)
        
        for route in self.routes:
            self.add_route(route)

    # List all continents and their cities
    def continents_cities(self):
        for continent in self.continents:
            cities = self.continents[continent]
            string = continent + ": "
            for i in range(0,len(cities)):
                string += cities[i] +", "
            print string

    # add city function will add city to the dictionary by city code
    def add_city(self, data):
        city = City(data)
        # Cannot add the city because it already here
        if city.code in self.city:
            print("PLEASE USE DISTINGUISHED CITY CODE")
            return
        self.city[city.code] = city
        self.city_num += 1
        self.pop_sum += city.population
        if city.continent in self.continents:
            lst = self.continents[city.continent]
            lst.append(city.name)
            self.continents[city.continent] = lst
        else:
            self.continents[city.continent] = [city.name]

    # Remove the city and its corresponding edges
    def remove_city(self,city_name):
        the_city = self.city[city_name]
        self.city_num -= 1
        self.pop_sum -= the_city.population;

        lst = []
        for (dep,arr) in self.flight_distance:
            if dep == city_name or arr == city_name:
                lst.append((dep,arr))
        for i in range(0,len(lst)):
            del self.flight_distance[lst[i]]

        self.continents[the_city.continent].remove(the_city.name)
        del self.city[city_name]

    # Remove a route and update everything
    # If there is no edge between them, do nothing
    def remove_route(self,code1,code2):
        try:
            distance = self.flight_distance[(code1,code2)]
        except:
            print("There is no route between them")
            return
        self.dist_sum -= self.flight_distance[(code1,code2)]
        del self.flight_distance[(code1,code2)]
        self.city[code1].hubs -=1
        self.route_sum -= 1

    # Store the route by (depature,arrival) with their distance
    def add_route(self,data):
        departure = data['ports'][0]
        arrival = data['ports'][1]
        distance = int(data['distance'])
        self.dist_sum += distance
        self.route_sum +=1
        self.flight_distance[(departure,arrival)] = distance
        self.city[departure].hubs += 1

    # Search for the max population city
    def max_pop(self):
        max_pop = 0
        max_city = None
        for code in self.city:
            city = self.city[code]
            if city.population > max_pop:
                max_pop = city.population
                max_city = city
        print ("Largest population at {} is {}\n".format(max_city.name,max_pop))
        return max_city

    # Search for the min population city
    def min_pop(self):
        min_pop = -1
        min_city = None
        for code in self.city:
            city = self.city[code]
            if city.population < min_pop or min_pop < 0:
                min_pop = city.population
                min_city = city
        print ("Smallest population at {} is {}\n".format(min_city.name,min_pop))
        return min_city

    # Search for the max distance city
    def max_dist(self):
        max_dist = 0
        city_one = None
        city_two = None
        for (one,two) in self.flight_distance:
            distance = self.flight_distance[(one,two)]
            if distance > max_dist:
                city_one = self.city[one]
                city_two = self.city[two]
                max_dist = distance
        print ("Largest distance between {} and {} is {}\n".format(city_one.name,city_two.name,max_dist))
        return city_one,city_two,max_dist

    # Search for the min distance city
    def min_dist(self):
        min_dist = -1
        city_one = None
        city_two = None
        for (one,two) in self.flight_distance:
            distance = self.flight_distance[(one,two)]
            if distance < min_dist or min_dist < 0:
                city_one = self.city[one]
                city_two = self.city[two]
                min_dist = distance
        print ("Smallest distance between {} and {} is {}\n".format(city_one.name,city_two.name,min_dist))
        return city_one,city_two,min_dist

    # Simple return average of population
    def avg_pop(self):
        print ("Average population is {}\n".format(self.pop_sum/self.city_num))
        return (self.pop_sum/self.city_num)

    # Simple return average of distance
    def avg_dist(self):
        print ("Average distance is {}\n".format(self.dist_sum/self.route_sum))
        return self.dist_sum/self.route_sum

    # Find and return list of hub cities
    def hub_cities(self):
        hub_city = []
        max_connection = 0
        for code in self.city:
            my_city = self.city[code]
            if my_city.hubs > max_connection:
                hub_city = []
                hub_city.append(my_city.name)
                max_connection = my_city.hubs
            elif my_city.hubs == max_connection:
                hub_city.append(my_city.name)
        print("The hub city with hub number " + str(max_connection)+ " is/are:")
        for i in range (0,len(hub_city)):
            print (hub_city[i])
        return max_connection

    # Open browser to see all the cities and routes
    def open_browser(self):
        url = 'http://www.gcmap.com/mapui?P='
        count =0
        for (departure,arrival) in self.flight_distance:
            if count > 0:
                url += ',+'
            url += departure + '-' + arrival
            count +=1
        print url
        webbrowser.open_new_tab(url)

    # Save the map back to JSON
    def save_file(self,file_name):
        if len(file_name) == 0:
            file_name = '../Data/default_output.json'
        data = {}
        data['data sources'] = self.source
        data['metros'] = []
        for code in self.city:
            entry = self.city[code].get_data()
            data['metros'].append(entry)

        data['routes'] = []
        for (dep,arr) in self.flight_distance:
            entry = {}
            entry['ports'] = []
            entry['ports'].append(dep)
            entry['ports'].append(arr)
            entry['distance'] = self.flight_distance[(dep,arr)]
            data['routes'].append(entry)

        with open(file_name,'w') as src:
            json.dump(data,src,indent=4)
            src.close()

    # Merge two map into a map
    def merge_map(self,new_file):
        new_map = FlightMap(new_file)
        for code in new_map.city:
            data = new_map.city[code].get_data()
            self.add_city(data)

        for (dep,arr) in new_map.flight_distance:
            data = {}
            data['ports'] = [dep,arr]
            data['distance'] = int(new_map.flight_distance[(dep,arr)])
            self.add_route(data)

    # Find all the neighbors the city can directly go to
    def find_neighbor(self,code):
        lst = []
        for (dep,arr) in self.flight_distance:
            if dep == code:
                lst.append(arr)
        return lst

    # Dijkstra algorithm to find the shortest path between two cities
    def dijkstra(self,start,end):
        dist = {}
        prev = {}
        vertex_set = []
        for code in self.city:
            dist[code] = float("infinity")
            prev[code] = ""
            vertex_set.append(code)
        dist[start] = 0.0

        while not len(vertex_set) == 0:
            min_dist = -1
            for code in vertex_set:
                if min_dist < 0 or min_dist > dist[code]:
                    min_dist = dist[code]
                    vertex = code
            if vertex == end:
                break
            vertex_set.remove(vertex)
            vertex_neighbor = self.find_neighbor(vertex)
            for neighbor in vertex_neighbor:
                alt = dist[vertex] + self.flight_distance[(vertex,neighbor)]
                if alt < dist[neighbor]:
                    dist[neighbor] = alt
                    prev[neighbor] = vertex
        return dist,prev

    # Edit city code
    def edit_code(self,the_city,city_code,new_code):
        dic = {}
        for (dep,arr) in self.flight_distance:
            if dep == city_code or arr == city_code:
                dic[(dep,arr)] = dep == city_code
        for (dep,arr) in dic:
            if dic[(dep,arr)]:
                self.flight_distance[(new_code,arr)] = self.flight_distance[(dep,arr)]
            else:
                self.flight_distance[(dep,new_code)] = self.flight_distance[(dep,arr)]
            del self.flight_distance[(dep,arr)]
        self.city[city_code].code = new_code
        self.city[new_code] = self.city[city_code]
        del self.city[city_code]

    # Edit city name
    def edit_name(self,the_city, city_code,new_name):
        continent = the_city.continent
        name = the_city.name
        self.continents[continent].remove(name)
        self.continents[continent].append(new_name)
        self.city[city_code].name = new_name

    # Edit city continent
    def edit_continent(self,the_city, city_code,new_continent):
        old_continent = self.city[city_code].continent
        same = old_continent == new_continent
        name = the_city.name
        if not same:
            self.continents[old_continent].remove(name)
        if not new_continent in self.continents:
            self.continents[new_continent] =[name]
        else:
            self.continents[new_continent].append(name)
        self.city[city_code].continent = new_continent
        if len(self.continents[old_continent]) == 0:
            del self.continents[old_continent]

    # Edit city Coordinate
    def edit_coordinate(self,city_code,latitude,longitude,la_num,lo_num):
        self.city[city_code].coordinates.clear()
        self.city[city_code].coordinates[latitude] = la_num
        self.city[city_code].coordinates[longitude] = lo_num

    # Edit time zone
    def edit_timezone(self,city_code,new_timezone):
        self.city[city_code].timezone = new_timezone

    # Edit city population
    def edit_population(self,city_code,new_population):
        diff = new_population - self.city[city_code].population
        self.pop_sum += diff
        self.city[city_code].population = new_population

    # Edit time region
    def edit_region(self,city_code,new_region):
        self.city[city_code].region = new_region







