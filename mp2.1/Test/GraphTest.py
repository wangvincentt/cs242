import unittest
import os
from src.FlightMap import FlightMap


class MyTestCase(unittest.TestCase):

    def setUp(self):
        filename = '../Data/map_data.json'
        self.map = FlightMap(filename)

    def test_avg_pop(self):
        count = 0
        tot_pop = 0.0
        avg_pop = self.map.avg_pop()
        for code in self.map.city:
            city = self.map.city[code]
            count +=1
            try:
                tot_pop += int(city.population)
            except:
                pass

        avg_test = tot_pop/count
        self.assertEqual(avg_test,avg_pop)

    def test_avg_route(self):
        count = 0
        tot_dist = 0.0
        avg_route = self.map.avg_dist()
        for (cityOne,cityTwo) in self.map.flight_distance:
            dist = self.map.flight_distance[(cityOne,cityTwo)]
            count +=1
            tot_dist += int(dist)

        avg_test = tot_dist/count
        self.assertEqual(avg_test,avg_route)

    def test_hub_city(self):
        hub_lst = self.map.hub_cities()

    def test_max_pop(self):
        my_city = self.map.max_pop()
        max_pop = int(my_city.population)
        result = True
        for code in self.map.city:
            my_city = self.map.city[code]
            if max_pop < int(my_city.population):
                result = False
                break
        self.assertEqual(result,True)

    def test_min_pop(self):
        my_city = self.map.min_pop()
        min_pop = int(my_city.population)
        result = True
        for code in self.map.city:
            my_city = self.map.city[code]
            if min_pop > int(my_city.population):
                result = False
                break
        self.assertEqual(result,True)

    def test_longest_dist(self):
        city_one,city_two,max_dist = self.map.max_dist()
        max_dist = int(max_dist)
        result = True
        for (a,b) in self.map.flight_distance:
            dist = self.map.flight_distance[(a,b)]
            if max_dist < dist:
                result = False
                break
        self.assertEqual(result,True)

    def test_shortest_dist(self):
        city_one,city_two,min_dist = self.map.min_dist()
        min_dist = int(min_dist)
        result = True
        for (a,b) in self.map.flight_distance:
            dist = self.map.flight_distance[(a,b)]
            if min_dist > dist:
                result = False
                break
        self.assertEqual(result,True)

    def test_continent(self):
        result = True
        for code in self.map.city:
            my_city = self.map.city[code]
            cities = self.map.continents[my_city.continent]
            exist = False
            for city in cities:
                if city == my_city.name:
                    exist = True
                    break
            if not exit:
                result = False
                break
        self.assertEqual(result,True)

    def test_save_file(self):
        self.map.save_file("")

    def test_find_neighbor(self):
        code = 'cmi'
        lst = self.map.find_neighbor(code)
        self.assertEqual(0,len(lst))

    def test_dijkstra(self):
        start = 'MEX'
        end = 'CHI'
        dist,prev = self.map.dijkstra(start,end)
        self.assertEqual(2714,dist[end])

    def test_edit_code(self):
        the_city = self.map.city['HKG']
        city_code = 'HKG'
        new_code = 'TAI'
        self.map.edit_code(the_city,city_code,new_code)
        self.assertEqual(self.map.city['TAI'].code,'TAI')

    def test_edit_name(self):
        the_city = self.map.city['HKG']
        city_code = 'HKG'
        new_name = 'SMALL HK'
        self.map.edit_name(the_city, city_code,new_name)
        self.assertEqual(self.map.city['HKG'].name,new_name)

    def test_edit_continent(self):
        the_city = self.map.city['HKG']
        city_code = 'HKG'
        new_continent = 'GO BACK BRITISH'
        self.map.edit_continent(the_city, city_code,new_continent)
        self.assertEqual(self.map.city['HKG'].continent,new_continent)

    def test_edit_timezone(self):
        the_city = self.map.city['HKG']
        city_code = 'HKG'
        new_timezone = 10
        self.map.edit_timezone(city_code,new_timezone)
        self.assertEqual(self.map.city['HKG'].timezone,new_timezone)

    def test_edit_population(self):
        the_city = self.map.city['HKG']
        city_code = 'HKG'
        new_population = 2
        self.map.edit_population(city_code,new_population)
        self.assertEqual(self.map.city['HKG'].population,new_population)
        # Test the min and max population after edit
        self.assertEqual(self.map.min_pop().population,2)
        new_population = 2000000000
        self.map.edit_population(city_code,new_population)
        self.assertEqual(self.map.city['HKG'].population,new_population)
        self.assertEqual(self.map.max_pop().population,2000000000)

    def test_edit_region(self):
        the_city = self.map.city['HKG']
        city_code = 'HKG'
        new_region = 1
        self.map.edit_region(city_code,new_region)
        self.assertEqual(self.map.city['HKG'].region,new_region)

    def test_edit_coordinate(self):
        city_code = 'HKG'
        latitude = 'N'
        longitude = 'E'
        la_num = 1
        lo_num = 1
        self.map.edit_coordinate(city_code,latitude,longitude,la_num,lo_num)
        self.assertEqual(self.map.city['HKG'].coordinates[latitude],la_num)
        self.assertEqual(self.map.city['HKG'].coordinates[longitude],lo_num)

    def test_add_and_remove_city(self):
        data = {}
        data['code'] = 'HZ'
        data['name'] = 'Hangzhou'
        data['country'] = 'CHI'
        data['continent'] = 'ASIA'
        data['timezone'] = '1'
        data['coordinates'] = {}
        data['coordinates']['N'] = '30'
        data['coordinates']['E'] = '120'
        data['population'] = 70000000
        data['region'] = '1'
        self.map.add_city(data)
        self.assertEqual(self.map.max_pop().population,70000000)
        self.map.remove_city('HZ')
        self.assertEqual(self.map.max_pop().population,34000000)

    def test_merge(self):
        file_name = '../Data/cmi_hub.json'
        self.map.merge_map(file_name)
        self.assertEqual(self.map.hub_cities(),9)

    def test_add_and_remove_route(self):
        data = {}
        data['ports'] = {}
        data['ports'][0] = 'MNL'
        data['ports'][1] = 'HKG'
        data['distance'] = '2'
        self.map.add_route(data)
        city_one,city_two,min_dist = self.map.min_dist()
        self.assertEqual(min_dist,2)
        self.map.remove_route('MNL','HKG')
        city_one,city_two,min_dist = self.map.min_dist()
        self.assertEqual(min_dist,334)

if __name__ == '__main__':
    unittest.main()

