__author__ = "jwang135"


class City:

    '''
        Default City constructor by json
    '''
    def __init__(self,data):
        self.code = data['code']
        self.name = data['name']
        self.country = data['country']
        self.continent = data['continent']
        self.timezone = data['timezone']
        self.coordinates = data['coordinates']
        self.population = data['population']
        self.region = data['region']
        self.hubs = 0


    # get longitude for the city
    def get_longitude(self):
        if "W" in self.coordinates:
            return "{}W".format(self.coordinates["W"])
        else:
            return "{}E".format(self.coordinates["E"])

    # get latitude for the city
    def get_latitude(self):
        if "S" in self.coordinates:
            return "{}S".format(self.coordinates["S"])
        else:
            return "{}N".format(self.coordinates["N"])

    # print all contents out
    def print_query(self):
        print("Its code:{}".format(self.code))
        print("Its name:{}".format(self.name))
        print("Its country:{}".format(self.country))
        print("Its continent:{}".format(self.continent))
        print("Its timezone:{}".format(self.timezone))
        print("Its latitude:{}".format(self.get_latitude))
        print("Its longitude:{}".format(self.get_longitude))
        print("Its population:{}".format(self.population))
        print("Its region:{}".format(self.region))

    def get_data(self):
        entry = {}
        entry['code'] = self.code
        entry['name'] = self.name
        entry['country'] = self.country
        entry['timezone'] = self.timezone
        entry['coordinates'] = self.coordinates
        entry['population'] = self.population
        entry['region'] = self.region
        entry['continent'] = self.continent
        return entry
