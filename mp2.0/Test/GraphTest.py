import unittest
from src.FlightMap import FlightMap


class MyTestCase(unittest.TestCase):

    def setUp(self):
        filename = '/Users/Vincent/Desktop/cs242/mp2.0/Data/map_data.json'#'../Data/map_data.json'
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
        result = True
        hub_lst = self.map.hub_cities()
        hub_num = 0
        for code in self.map.city:
            my_city = self.map.city[code]
            hub_num = max(hub_num,my_city.hubs)

        for hubs in hub_lst:
            for code in self.map.city:
                my_city = self.map.city[code]
                if my_city.name == hubs:
                    if hub_num !=my_city.hubs:
                        result = False

        self.assertEqual(result,True)


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

if __name__ == '__main__':
    unittest.main()

