from .function3 import apiCall, foodApiCall
import random

def linearItinerary(location, trip, day, start, end, food=False, filters=False, night=False, vegetarian=False, previous='', itineray=None, activities=None, used_filters=None):
    print("new call")
    if time > (end - 40):
        #valid check
        return itineray
    
    if itineray == None:
        itineray = []
    if activities == None and used_filters == None:
        activities = []
        used_filters = []

    timeDict = {
        480 : "serves_breakfast",
        540 : ["serves_breakfast", filters],
        600 :["serves_breakfast", filters],
        660 : filters, 
        720 : ["serves_lunch", filters],
        780 : ["serves_lunch", filters],
        840 : ["serves_lunch", filters], 
        900 :  filters,
        960 :  filters,
        1020 : ["serves_lunch", filters],
        1080 : ["serves_lunch", filters],
        1140 :  ["serves_lunch", filters],
        1200 : "bar"
    }
    time = start
    roundedTime = round_nearest_hour(time)

    
    if not filters:
        filters = used_filters
    
    types = timeDict[roundedTime]
    random.shuffle(filters) 
    search = True
    i = 0
    while search:
        if time > 1200:
            activity , startTime, endTime = apiCall(location, time, night, trip, day, activities, previous)
        else:
            if isinstance(types, list):
                if food and types[0] in food:
                    type = types[0]
                    activity, startTime, endTime = foodApiCall(location, time, type, trip, day, activities, previous, vegetarian)
                else:
                    type = (types[1])[i]
                    activity , startTime, endTime = apiCall(location, time, type, trip, day, activities, previous)
                    i += 1

            else:
                type = filters[i]
                activity, startTime, endTime = apiCall(location, time, type, trip, day, activities, previous)
                i += 1
        if activity:
            search = False
    activityDetails = activity + ';' + str(startTime) + ';' + str(endTime)
    itineray.append(activityDetails)
    activities.append[activity]
    if type != "serves_breakfast" and type != "serves_lunch" and type != "serves_dinner":
        used_filters.append(type)
        filters.remove(type)
    else:
        food.remove(type)

    itineray = linearItinerary(location, trip, day, endTime, end, food, filters, night, vegetarian, activity, itineray, activities)
    return itineray
    
    


def round_nearest_hour(time):
    remainder = time % 60
    if remainder < 31:
        rounded = time - remainder
    else :
        rounded = time - remainder + 60

    return rounded