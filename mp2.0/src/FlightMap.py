__author__ = "jwang135"

import sys
import json
import webbrowser
from src.City import City
from src.FlightRoutine import FlightRoutine

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
        with open (filename,'r') as src:
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
        self.city[city.code] = city
        self.city_num += 1
        self.pop_sum += city.population
        if city.continent in self.continents:
            lst = self.continents[city.continent]
            lst.append(city.name)
            self.continents[city.continent] = lst
        else:
            self.continents[city.continent] = [city.name]

    # Store the route by (depature,arrival) with their distance
    def add_route(self,data):
        departure = data['ports'][0]
        arrival = data['ports'][1]
        distance = int(data['distance'])
        self.dist_sum +=distance
        self.route_sum +=1
        self.flight_distance[(departure,arrival)] = distance
        self.flight_distance[(arrival,departure)] = distance
        self.city[departure].neighbors[arrival] = 1
        self.city[arrival].neighbors[departure] = 1
        self.city[departure].hubs +=1
        self.city[arrival].hubs +=1

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
        hub_cities = []
        max_connection = 0
        for code in self.city:
            my_city = self.city[code]
            if my_city.hubs > max_connection:
                hub_cities = []
                hub_cities.append(my_city.name)
                max_connection = my_city.hubs
            elif my_city.hubs == max_connection:
                hub_cities.append(my_city.name)
        print("The hub city is:")
        for i in range (0,len(hub_cities)):
            print (hub_cities[i])
        return hub_cities

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
