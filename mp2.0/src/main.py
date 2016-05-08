import sys
from src.FlightMap import FlightMap

'''
 This is main file for text-base user interface
'''


# Print out commands for users to select
def command_out():
    file_name = "/Users/Vincent/Desktop/cs242/mp2.0/Data/output1.txt"
    with open(file_name, 'r') as fin:
        print fin.read()


def city_all_flight(city):
    print ("All its non-stop flight and distance:\n")
    for neibors in city.neighbors:
        name = map.city[neibors].code
        dist = map.flight_distance[(city.code,name)]
        print (city.name + ' to ' + name + ': ' + str(dist) +'\n')


# To deal with asking for city information
def city_information(city):
    while True:
        file_name = "/Users/Vincent/Desktop/cs242/mp2.0/Data/output2.txt"
        with open(file_name, 'r') as fin:
            print fin.read()

        target = raw_input()
        try:
            target = int(target)
        except:
            continue

        if target == 0:
            break
        if target == 1:
            print(city.code)
        elif target == 2:
            print city.name
        elif target == 3:
            print city.country
        elif target == 4:
            print city.continent
        elif target == 5:
            print city.timezone
        elif target == 6:
            print city.get_latitude()
        elif target == 7:
            print city.get_longitude()
        elif target == 8:
            print city.population
        elif target == 9:
            print city.region
        elif target == 10:
            city_all_flight(city)


# Handle for situation for statistics information
def stats_info():
    while True:
        file_name = "/Users/Vincent/Desktop/cs242/mp2.0/Data/output3.txt"
        with open(file_name, 'r') as fin:
            print fin.read()
        target = raw_input()
        try:
            target = int(target)
        except:
            continue

        if target == 0:
            break
        elif target == 1:
            map.max_dist()
        elif target == 2:
            map.min_dist()
        elif target == 3:
            map.avg_dist()
        elif target == 4:
            map.max_pop()
        elif target == 5:
            map.min_pop()
        elif target == 6:
            map.avg_pop()
        elif target == 7:
            map.continents_cities()
        elif target == 8:
            map.hub_cities()


# Deal with command
def command_deal(command):
    if command == 1:
        count = 0
        print ("List of all cities in CSAir:\n")
        for my_city in map.city:
            print (map.city[my_city].name)
            count +=1
        print("Total number of cities in CSAir:{}\n".format(count))
    elif command == 2:
        target = raw_input("Which city do you want to search?\n")
        match = False
        for my_city in map.city:
            if map.city[my_city].name.lower() == target.lower() or target.upper() == my_city:
                city_information(map.city[my_city])
                match = True
                break
        if not match:
            print("Your input does not match any city\n")
    elif command == 3:
        stats_info()
    elif command == 4:
        map.open_browser()


if __name__ == '__main__':
    filename = '../Data/map_data.json'
    map = FlightMap(filename)
    print ("Program started. Waiting for input.")

    while True:
        command_out()
        command = raw_input()

        try:
            command = int(command)
        except:
            print("Invalid input, please try again!\n")
            continue

        if command > 4 or command < 0:
            print("Invalid input, please try again!\n")
            continue

        if command == 0:
            break

        command_deal(command)
