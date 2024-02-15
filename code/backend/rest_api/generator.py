#from apiCalls import apiCall, foodApiCall
from .apiCalls import apiCall, foodApiCall
from .roundApiCalls import cApiCall, cFoodApiCall
from pymongo import MongoClient
from load_env_var import get_env_value
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def linearItinerary(location, trip, day, start, end, food=False, filters=False, night=False, vegetarian=False, previous='', itineray=None, activities=None, used_filters=None):
    print("new call")
    if start > (end - 40):
        #valid check
        print("ended here")
        return True, itineray
    
    if itineray == None:
        itineray = []
    if activities == None:
        activities = []
    if used_filters == None:
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
    print(f"this one {roundedTime}, {time}")

    
    if not filters:
        filters = used_filters
    
    types = timeDict[roundedTime]
    failed = []
    while True:
        search = True
        i = 0
        while i < len(filters) and search:
            if time > 1200 and night:
                api_result = apiCall(location, time, night, trip, day, activities, previous, failed)
            else:
                if isinstance(types, list):
                    if food and types[0] in food:
                        current_type = types[0]
                        api_result = foodApiCall(location, time, current_type, trip, day, activities, previous, vegetarian, failed)
                        if api_result == None:
                            api_result = apiCall(location, time, "food", trip, day, activities, previous, failed)
                    else:
                        current_type = filters[i]
                        if current_type:
                            print(f"item - {current_type}")
                            api_result = apiCall(location, time, current_type, trip, day, activities, previous, failed)
                            i += 1
        
                else:
                    current_type = filters[i]
                    api_result = apiCall(location, time, current_type, trip, day, activities, previous)
                    i += 1

            if api_result:
                activity, startTime, endTime = api_result
                if endTime > end:
                    if endTime - end <= 20: # leeway 
                        endTime = end
                        search = False
                else:
                    search = False
            else:
                print("No valid activity found. Continuing search.")

        if api_result == None:
            return False, previous

    # Continue with the rest of your code...
        # print("error sector 1")
        activityDetails = activity + ';' + str(startTime) + ';' + str(endTime)
        itineray.append(activityDetails)
        activities.append(activity)
        if current_type != "serves_breakfast" and current_type != "serves_lunch" and current_type != "serves_dinner":
            used_filters.append(current_type)
            filters.remove(current_type)
        else:
            food.remove(current_type)


        itineraryResult = linearItinerary(location, trip, day, endTime, end, food, filters, night, vegetarian, activity, itineray, activities)
        if itineraryResult[0]:
            break
        failed.append(itineraryResult[1])


    # Append 


    return True , itineray

@csrf_exempt
def circularItinerary(location, trip, day, start, end, food=False, filters=False, night=False, vegetarian=False, previous='', itineray=None, activities=None, used_filters=None):
    print("new call")
    if start > (end - 40):
        #valid check
        result = isValid(location[2], previous)
        return True, itineray
    
    if itineray == None:
        itineray = []
    if activities == None:
        activities = []
    if used_filters == None:
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
    print(f"this one {roundedTime}, {time}")

    
    if not filters:
        filters = used_filters
    
    types = timeDict[roundedTime]
    failed = []
    while True:
        search = True
        i = 0
        while i < len(filters) and search:
            if time > 1200:
                api_result = cApiCall(location, time, start, end, night, trip, day, activities, previous, failed)
            else:
                if isinstance(types, list):
                    if food and types[0] in food:
                        current_type = types[0]
                        api_result = cFoodApiCall(location, time, start, end,  current_type, trip, day, activities, previous, vegetarian, failed)
                        if api_result == None:
                            api_result = cApiCall(location, time, start, end,  "food", trip, day, activities, previous, failed)
                    else:
                        current_type = filters[i]
                        if current_type:
                            print(f"item - {current_type}")
                            api_result = cApiCall(location, time, start, end,  current_type, trip, day, activities, previous, failed)
                            i += 1
        
                else:
                    current_type = filters[i]
                    api_result = cApiCall(location, time, start, end,  current_type, trip, day, activities, previous)
                    i += 1

            if api_result is not None:
                activity, startTime, endTime = api_result
                if endTime > end:
                    if endTime - end <= 20: # leeway 
                        endTime = end
                        search = False
                else:
                    search = False
            else:
                print("No valid activity found. Continuing search.")

        if api_result == None:
            return False, previous

    # Continue with the rest of your code...

        activityDetails = activity + ';' + str(startTime) + ';' + str(endTime)
        itineray.append(activityDetails)
        activities.append(activity)
        if current_type != "serves_breakfast" and current_type != "serves_lunch" and current_type != "serves_dinner":
            used_filters.append(current_type)
            filters.remove(current_type)
        else:
            food.remove(current_type)


        itineraryResult = circularItinerary(location, trip, day, endTime, end, food, filters, night, vegetarian, activity, itineray, activities)
        if itineraryResult[0]:
            break
        failed.append(itineraryResult[1])


    # Append 


    return True, itineray
    
    

@csrf_exempt
def round_nearest_hour(time):
    remainder = time % 60
    if remainder < 31:
        rounded = time - remainder
    else :
        rounded = time - remainder + 60

    return rounded

@csrf_exempt
def isValid(startLocation, endLocation):
    lat,lon = startLocation

    client = MongoClient(get_env_value('MONGO_URL'))
    db = client["Belgium"]
    collection = db["Brussles"]

    query = {
                "geometry.location": {
                    "$near": {
                        "$geometry": {
                            "type": "Point",
                            "coordinates": [lat, lon]
                        },
                        "$maxDistance": 2000  # maximum distance in meters 
                    }
                }
            }
    
    documents = list(collection.find(query))

    for doc in documents:
        id = doc.get("place_id")
        if id == endLocation:
            return True
    return False