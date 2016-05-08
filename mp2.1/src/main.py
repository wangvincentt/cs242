import sys
from src.FlightMap import FlightMap

'''
 This is main file for text-base user interface
'''


# Print out commands for users to select
def command_out():
    file_name = "../Data/output1.txt"
    with open(file_name, 'r') as fin:
        print fin.read()


# Print out all the cities that city can directly go to
def city_all_flight(city):
    print ("All its non-stop flight and distance:\n")
    code = city.code
    for (dep,arr) in map.flight_distance:
        if dep == code:
            dist = map.flight_distance[(dep,arr)]
            name = map.city[arr].name
            print (city.name + ' to ' + name + ': ' + str(dist) +'\n')


# To deal with asking for city information
def city_information(city):
    while True:
        file_name = "../Data/output2.txt"
        with open(file_name, 'r') as fin:
            print fin.read()

        target = raw_input()
        try:
            target = int(target)
        except:
            print("Invalid input!")
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
        file_name = "../Data/output3.txt"
        with open(file_name, 'r') as fin:
            print fin.read()
        target = raw_input()
        try:
            target = int(target)
        except:
            print("Invalid input")
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


# Input is code or city name or invalid, return the code of city or "FALSE"
def name_code(code_input):
    code_input = code_input.upper()
    if code_input in map.city:
        return code_input
    code_input = code_input.lower()
    for code in map.city:
        if map.city[code].name.lower() == code_input:
            return map.city[code].code
    return "FALSE"


# Add a route to the map
# While ask user to input valid inputs
def add_route():
    while True:
        departure = raw_input("departure")
        arrival = raw_input("arrival")
        departure = name_code(departure)
        arrival = name_code(arrival)
        if departure == 'FALSE' or arrival == 'FALSE' :
            print("At least one of the port does not exist, try again")
            continue
        break

    while True:
        distance = raw_input("distance")
        try:
            distance = int(distance)
        except:
            print("Invalid distance input, please try again")
            continue
        if distance < 0:
            print("Invalid distance input, please try again")
            continue
        break
    if (departure,arrival) in map.flight_distance:
        print("This route exists on the map, do nothings")
        return
    data = {}
    data['ports'] = {}
    data['ports'][0] = departure
    data['ports'][1] = arrival
    data['distance'] = distance
    map.add_route(data)


# Add city to the map
# Will ask user to input city information and check whether it is valid
def add_city():
        code = raw_input("code")
        code = code.upper()
        name = raw_input("name")
        country = raw_input("country")
        continent = raw_input("continent")
        while True:
            timezone = raw_input("timezone")
            population = raw_input("population")
            region = raw_input("region")
            try:
                timezone = int(timezone)
                population = int(population)
                region = int(region)
            except:
                continue
            break

        while True:
            latitude = raw_input("N or S ?")
            longitude = raw_input("E or W ?")
            latitude = latitude.upper()
            longitude = longitude.upper()
            if not (latitude == 'N' or latitude == 'S'):
                continue
            if not (longitude == 'E' or longitude == 'W'):
                continue
            la_num = raw_input("How many latitude")
            lo_num = raw_input("How many longitude")
            try:
                la_num = int(la_num)
                lo_num = int(lo_num)
            except:
                print("Invalid input, please try again")
                continue
            if la_num > 90 or la_num < 0 or lo_num >180 or lo_num < 0:
                print("Longitude or latitude out of range, please try again")
                continue
            break
        data = {}
        data['code'] = code
        data['name'] = name
        data['country'] = country
        data['continent'] = continent
        data['timezone'] = timezone
        data['coordinates'] = {}
        data['coordinates'][latitude] = la_num
        data['coordinates'][longitude] = lo_num
        data['population'] = population
        data['region'] = region
        map.add_city(data)


def edit_input(out):
    while True:
        new_output = raw_input(out)
        if len(new_output) == 0:
            print("No input, try again")
            continue
        break
    return new_output


def int_input(s):
    while True:
        new = edit_input(s)
        try:
            new = int(new)
        except:
            print(s + " must be integer, please try again")
            continue
        break
    return new


# Edit city's code to a new one and update it in all dictionaries
def edit_code(the_city,city_code):
    new_code = edit_input("New Code")
    new_code = new_code.upper()
    map.edit_code(the_city,city_code,new_code)


# Edit city's name to a new one
def edit_name(the_city, city_code):
    new_name = edit_input("New Name")
    map.edit_name(the_city, city_code,new_name)


# Edit city's country to a new one
def edit_country(city_code):
    new_country = edit_input("New Country")
    map.city[city_code].country = new_country


# Edit city's continents to a new one
def edit_continent(the_city, city_code):
    new_continent = edit_input("New Continent")
    map.edit_continent(the_city, city_code,new_continent)


# Edit city's coordinates to a new one
def edit_coordinates(city_code):
    while True:
        latitude = raw_input("N or S ?")
        longitude = raw_input("E or W ?")
        latitude = latitude.upper()
        longitude = longitude.upper()
        if not (latitude == 'N' or latitude == 'S'):
            continue
        if not (longitude == 'E' or longitude == 'W'):
            continue
        la_num = raw_input("How many latitude")
        lo_num = raw_input("How many longitude")
        try:
            la_num = int(la_num)
            lo_num = int(lo_num)
        except:
            print("Invalid input, please try again")
            continue
        if la_num > 90 or la_num < 0 or lo_num >180 or lo_num < 0:
            print("Longitude or latitude out of range, please try again")
            continue
        map.edit_coordinate(city_code,latitude,longitude,la_num,lo_num)
        break


# call function to edit the city timezone
def edit_timezone(city_code):
    new_timezone = int_input("Timezone")
    map.edit_timezone(city_code,new_timezone)


# call function to edit the city Population
def edit_population(city_code):
    new_population = int_input("Population")
    map.edit_population(city_code,new_population)


# call function to edit the city Region
def edit_region(city_code):
    new_region = int_input("Region")
    map.edit_region(city_code,new_region)


def edit_name(the_city,city_code):
    new_name = edit_input("New Name")
    continent = the_city.continent
    name = the_city.name
    map.continents[continent].remove(name)
    map.continents[continent].append(new_name)
    map.city[city_code].name = new_name


# Edit existing city's information
def edit_city():
    while True:
        city_code = raw_input("Please input city name/code")
        city_code = name_code(city_code)
        if city_code == 'FALSE':
            print("The city does not exist in the map")
            continue
        break
    city_name = map.city[city_code].name
    file_name = "../Data/output5.txt"
    with open(file_name, 'r') as fin:
        print fin.read()
    while True:
        select = raw_input()
        try:
            select = int(select)
        except:
            print("Invalid Command, please try again")
        break
    the_city = map.city[city_code]
    map.continents[the_city.continent].remove(the_city.name)
    map.continents[the_city.continent].append(the_city.name)
    if select == 1:
        edit_code(the_city,city_code)
    elif select == 2:
        edit_name(the_city,city_code)
    elif select == 3:
        edit_country(city_code)
    elif select == 4:
        edit_continent(the_city, city_code)
    elif select == 5:
        edit_timezone(city_code)
    elif select == 6:
        edit_coordinates(city_code)
    elif select == 7:
        edit_population(city_code)
    elif select == 8:
        edit_region(city_code)


# Deal with online edit command input
def online_edit():
    file_name = "../Data/output4.txt"
    with open(file_name, 'r') as fin:
        print fin.read()
    while True:
        selection = raw_input()
        try:
            selection = int(selection)
        except:
            print("Invalid input, please try again.")
            continue
        break

    if selection == 1:
        while True:
            city_name = raw_input("Please input your city code/name.")
            city_name = name_code(city_name)
            if city_name == 'FALSE':
                print("\nThe city does not exist on the map, try again")
                continue
            break
        map.remove_city(city_name)
    elif selection == 2:
        code1 = raw_input("Please input first code/name")
        code2 = raw_input("Please input second code/name")
        code1 = name_code(code1)
        code2 = name_code(code2)
        if code1 == "FALSE" or code2 == "FALSE":
            print("Code/name input cannot find")
            return
        map.remove_route(code1,code2)
    elif selection == 3:
        add_city()
    elif selection == 4:
        add_route()
    elif selection == 5:
        edit_city()
    elif selection == 0:
        return


# Save the map back to JSON file by FlightMap's function
def save_map():
    file_name = raw_input("Please input your filename")
    map.save_file(file_name)


# Merge two maps into a new one
def merge_files():
    while True:
        new_file = raw_input("Please enter new JSON file name. Default is /Data/cmi_hub.json")
        if len(new_file) == 0:
            new_file = "../Data/cmi_hub.json"
            break
        try:
            with open(new_file,'r')as f:
                t = 1
        except:
            print("No such file")
            continue
        break

    map.merge_map(new_file)


# 2ax = v^2, a = v^2/2x = 0.22
# 0.5at^2 = x
# Input is KM and output is hours
def flight_time(dist):
    distance = dist*1000.0
    acc = 0.109
    const_v = 208.33
    normal_time = const_v/acc
    if distance < 400000:
        half = distance/2.0
        time = (2.0*half/(acc))**(0.5)
        time *= 2.0
    else:
        rest = distance - 400000.00
        time_one = rest/const_v
        time = time_one + 2*normal_time
    return time/3600.00


# Input will be the code for the city
# Output will be the layover time for the city
def layover_time(city_code):
    min_connection = -1
    num_connection = map.city[city_code].hubs
    for code in map.city:
        if min_connection < 0:
            min_connection = map.city[city_code].hubs
        else:
            min_connection = min(min_connection,map.city[city_code].hubs)

    time = 2.0 - (1.0/6.0)*(num_connection - min_connection)
    return time


# User inputs the city
# Test for whether the route is valid first and enforce the user to re-input is not
# And then compute the cost and time for the route
def route_info():
    routes = []
    while True:
        city_name = raw_input("Please input the city name/code, or quit to end")
        if city_name.lower() == 'quit':
            break
        city_name = name_code(city_name)
        if city_name == 'FALSE':
            print("No city matches, please input again")
            continue
        if len(routes) > 0:
            try:
                map.flight_distance[(routes[-1],city_name)]
            except:
                print("Invalid route, please enter again")
                continue
        routes.append(city_name)
    if len(routes) < 2:
        print("not enough city number, exit")
        return
    calculate_route(routes)


# Helper function to calculate route information and print it out
def calculate_route(routes):
    tot_cost = 0.0
    time_one = 0.0
    time_two = 0.0
    my_route = routes[0]
    for i in range(1,len(routes)):
        cost = max(0.35 - 0.05*i,0)
        tot_cost += cost * map.flight_distance[(routes[i-1],routes[i])]
        time_one += flight_time(map.flight_distance[(routes[i-1],routes[i])])
        time_two += layover_time(routes[i-1])
        my_route += " to " + routes[i]

    print("The route is " + my_route)
    print("Total time is " + str(time_two + time_one) + " hours. The total cost is " + str(tot_cost))


# Return the shortest valid path between two cities and get the route info
# If there is no route between two cities, will print it with no route info
def two_cities_route():
    while True:
        city_one = raw_input("Please input first city name/code as departure\n")
        city_two = raw_input("Please input second city name/code as arrival\n")
        city_one = name_code(city_one)
        city_two = name_code(city_two)
        if city_one == 'FALSE' or city_two == 'FALSE':
            print("Invalid cities' name, please enter gain\n")
            continue
        break

    dist,prev = map.dijkstra(city_one,city_two)
    city_list = []
    city_list.append(city_two)
    curr = city_two
    if dist[city_two] == float("inf"):
        print("This is no route,please book our new Spacecraft service!")
        return

    while curr != city_one:
        city_list.append(prev[curr])
        curr = prev[curr]

    city_list.reverse()
    calculate_route(city_list)
    print ("The total distance is " + str(dist[city_two]) + '\n')


# Deal with command at first stage
def command_deal(my_command):
    if my_command == 1:
        count = 0
        print ("List of all cities in CSAir:\n")
        for my_city in map.city:
            print (map.city[my_city].name + " " +my_city)
            count +=1
        print("Total number of cities in CSAir:{}\n".format(count))
    elif my_command == 2:
        target = raw_input("Which city do you want to search?\n")
        match = False
        for my_city in map.city:
            if map.city[my_city].name.lower() == target.lower() or target.upper() == my_city:
                city_information(map.city[my_city])
                match = True
                break
        if not match:
            print("Your input does not match any city\n")
    elif my_command == 3:
        stats_info()
    elif my_command == 4:
        map.open_browser()
    elif my_command == 5:
        online_edit()
    elif my_command == 6:
        save_map()
    elif my_command == 7:
        merge_files()
    elif my_command == 8:
        route_info()
    elif my_command == 9:
        two_cities_route()

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

        if command > 9 or command < 0:
            print("Invalid input, please try again!\n")
            continue

        if command == 0:
            break
        command_deal(command)
