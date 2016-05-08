__author__ = "jwang135"


class FlightRoutine:

    # Default Constructor with departure city, arrival city and their distance
    def __init__(self,departure,arrival,distance):
        self.departure = departure
        self.arrival = arrival
        self.distance = distance

    def print_routine(self):
        print('{} to {} with distance {}'.format(self.departure, self.arrival,str(self.distance)))



