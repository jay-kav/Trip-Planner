#from apiCalls import apiCall, foodApiCall
from .apiCalls import apiCall, foodApiCall
from .distanceCalculator import haversine
from pymongo import MongoClient
from load_env_var import get_env_value
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def linearItinerary(toggle, collection, hotel, trip, day, start, end, food=False, filters=False, night=False, vegetarian=False, previous='', itineray=None, activities=None, used_filters=None):
    try: 
        print("new call")
        if start > (end - 40):
            #valid check
            print("ended here")
            if toggle:
                result = isValid(collection, hotel, previous)
                if result :
                    return True, itineray
                return False, previous
            
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
            1020 : ["serves_dinner", filters],
            1080 : ["serves_dinner", filters],
            1140 :  ["serves_dinner", filters],
            1200 : ["serves_dinner", filters],
            1260 :  filters,
            1320 :  filters,
            1380 : filters
        }
        time = start
        roundedTime = round_nearest_hour(time)
        print(f"this one {roundedTime}, {time}")

        
        if not filters:
            filters = used_filters
        
        types = timeDict[roundedTime]
        failed = []
        api_result = None
        while True:
            search = True
            i = 0
            while i < (len(filters) - 1) and search:
                if time > 1200 and night:
                    i += 1
                    if len(night) > 1:
                        nightActivity = chooseNightActivity(night, start)
                    else:
                        nightActivity = night[0]
                    api_result = apiCall(toggle, collection, hotel, time, start, end, nightActivity, trip, day, activities, previous, failed)
                else:
                    if isinstance(types, list):
                        if food and types[0] in food:
                            current_type = types[0]
                            api_result = foodApiCall(toggle, collection, hotel, time, start, end, current_type, trip, day, activities, previous, vegetarian, failed)
                            i += 1
                            if api_result == None:
                                api_result = apiCall(toggle, collection, hotel, time, start, end, "food", trip, day, activities, previous, failed)
                        else:
                            current_type = filters[i]
                            if current_type:
                                print(f"item - {current_type}")
                                api_result = apiCall(toggle, collection, hotel, time, start, end, current_type, trip, day, activities, previous, failed)
                                i += 1
            
                    else:
                        current_type = filters[i]
                        api_result = apiCall(toggle, collection, hotel, time, start, end, current_type, trip, day, activities, previous, failed)
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

            # print("error sector 1")
            activityDetails = activity + ';' + str(startTime) + ';' + str(endTime)
            itineray.append(activityDetails)
            activities.append(activity)
            if current_type != "serves_breakfast" and current_type != "serves_lunch" and current_type != "serves_dinner":
                used_filters.append(current_type)
                print(filters)
                print(f"error sue {current_type}")
                filters.remove(current_type)
            else:
                food.remove(current_type)


            itineraryResult = linearItinerary(toggle, collection, hotel, trip, day, endTime, end, food, filters, night, vegetarian, activity, itineray, activities)
            if itineraryResult[0]:
                break
            failed.append(itineraryResult[1])


        # Append 


        return True , itineray
    except Exception as e:
        print(f"An error occurred: {e}")
        return  JsonResponse({'reason': 'Could not make an itinerary to satisfy your filters'}) 


@csrf_exempt
def round_nearest_hour(time):
    remainder = time % 60
    if remainder < 31:
        rounded = time - remainder
    else :
        rounded = time - remainder + 60

    return rounded

@csrf_exempt
def isValid(collection , startLocation, endLocation):
    try:
        lat,lon = startLocation
        print(f" This is previous {endLocation}")

        query = {
                    "place_id": endLocation
        }
        
        document = collection.find_one (query)



        doc = document.get("geometry", {}).get("location", {})
        if haversine([lat, lon], [doc.get("lat"), doc.get("lng")]) <= 2:
            return True
        return False
    except Exception as e:
        print(f"An error occurred: {e}")
        return  False

@csrf_exempt
def chooseNightActivity(night, time):
    if time > 1320:
        return night[0]
    return night[1]
