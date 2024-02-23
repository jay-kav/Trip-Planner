from .apiCalls import apiCall, foodApiCall
from .distanceCalculator import haversine
from pymongo import MongoClient
from django.http import JsonResponse
from load_env_var import get_env_value
from django.views.decorators.csrf import csrf_exempt

# Function to create an itinerary
@csrf_exempt
def linearItinerary(toggle, collection, hotel, trip, day, start, end, food=False, filters=False, night=False, vegetarian=False, previous='', itineray=None, activities=None, used_filters=None):
    try: 
        # Base case check if there is any time left to make an itinerary
        if start > (end - 40):
           # print("ended here")
            print(f"start time {start}, endtime {end} ---------------------------------------------------------------------")
            # If round trip ensure the last activity is less than 2km away
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

        # Ensure a duplicate itinerary isn't created
        itineraryLength = len(itineray)

        # Heuriistic times to do certain activities
        timeDict = {
            480 : ["serves_breakfast", filters],
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

        # Round start time to the nearest hour
        time = start
        roundedTime = round_nearest_hour(time)

        # If not enough filters selected for the time frame
        if not filters:
            filters = used_filters
        
        # Get the activities to do 
        types = timeDict[roundedTime]
        failed = []
        current_type = None
        api_result = None

        # Search for a itinerary
        while True:
            print(f"check activities {activities}")
            # Check a duplicate hasn't been created
            if len(itineray) > itineraryLength:
                errorAmount = len(itineray) - itineraryLength
                itineray = itineray[:-errorAmount]
            search = True
            i = 0
            # True each filter until one is valid
            while i < (len(filters) - 1) and search:
                # If its past 7pm and the user chose night life
                if roundedTime >= 1140 and night:
                    i += 1
                    if len(night) > 1:
                        # Choose a night life activity
                        nightActivity = chooseNightActivity(night, start)
                    else:
                        nightActivity = night[0]
                    # Function queries the database for documents
                    api_result = apiCall(toggle, collection, hotel, time, start, end, nightActivity, trip, day, activities, previous, failed)
                else:
                    # If the there Heuristic gives multiple options
                    if isinstance(types, list):
                        # Attempt to give food first
                        if food and types[0] in food:
                            current_type = types[0]
                            # Alternative function for requesting food documents from the database
                            api_result = foodApiCall(toggle, collection, hotel, time, start, end, current_type, trip, day, activities, previous, vegetarian, failed)
                            i += 1
                            if api_result == None:
                                # If it fails to get a restraunt with the food type field , check for restraunts that serve at that time
                                api_result = apiCall(toggle, collection, hotel, time, start, end, "food", trip, day, activities, previous, failed)
                        else:
                            # If food option isn't available query database for an activity
                            current_type = filters[i]
                            if current_type:
                                # print(f"item - {current_type}")
                                api_result = apiCall(toggle, collection, hotel, time, start, end, current_type, trip, day, activities, previous, failed)
                                i += 1

                    # If Heuristc dictionary only returns one item query the database for it
                    else:
                        current_type = filters[i]
                        api_result = apiCall(toggle, collection, hotel, time, start, end, current_type, trip, day, activities, previous, failed)
                        i += 1
                
                # If an activity successfully found
                if api_result:
                    # Split the tuple into it activity and times
                    activity, startTime, endTime = api_result
                    # If time greater than finish time
                    if endTime > end:
                        if (endTime - end) <= 40: # Allow for time error 
                            endTime = end
                            # End search
                            search = False
                    else:
                        search = False
                else:
                    # Could not find an activity for the filter used
                    print("No valid activity found. Continuing search.")

            # If a combination cannot be found backtrack
            if api_result == None:
                return False, previous
            
            # Get the activity being used
            if current_type:
                processed = processString(current_type)
            else: 
                processed = processString(nightActivity)


            # Concatinate the activity , times and type to a string
            activityDetails = activity + ';' + str(startTime) + ';' + str(endTime) + ';'+  processed

            # Add to the itinerary
            itineray.append(activityDetails)
            # Add to list to ensure its not repeated
            activities.append(activity)

            # Remove the activity from the corrisponding group
            if current_type and current_type != "serves_breakfast" and current_type != "serves_lunch" and current_type != "serves_dinner":
                used_filters.append(current_type)
                filters.remove(current_type)
            elif current_type:
                food.remove(current_type)

            # Recursively call to get the next activity
            itineraryResult = linearItinerary(toggle, collection, hotel, trip, day, endTime, end, food, filters, night, vegetarian, activity, itineray, activities)
            # If successful break the loop
            if itineraryResult[0]:
                break
            # If failed append the activity that failed
            failed.append(itineraryResult[1])

            # If failed to make an itinerary and is behinning to backtrack , return all the unused loactions
            print(f"is this food ------------------------------------- {current_type}")
            if current_type and current_type != "serves_breakfast" and current_type != "serves_lunch" and current_type != "serves_dinner":
                filters.insert(i, current_type)
                activities.pop()
                print(f"test if the list grows {filters}")
            elif current_type:
                print(f"food added back in {current_type}")
                food.insert(0, current_type)
                activities.pop()

        # Return an Itinerary
        return True , itineray
    except Exception as e:
        print(f"An error occurred: {e}")
        return  JsonResponse({'error': 'Failed to create itinerary', 'reason': 'Could not make an itinerary to satisfy your selections'}) 


# Function to round time to the nearest hour
@csrf_exempt
def round_nearest_hour(time):
    remainder = time % 60
    if remainder < 31:
        rounded = time - remainder
    else :
        rounded = time - remainder + 60

    return rounded

# Function to check if last location is within a certain distance of the hotel
@csrf_exempt
def isValid(collection , startLocation, endLocation):
    try:
        lat,lon = startLocation

        # Get the places location 
        query = {
                    "place_id": endLocation
        }
        
        document = collection.find_one (query)



        doc = document.get("geometry", {}).get("location", {})
        # Calculate the distance in kilometers using the haversine formula ensure its less than 2km
        if haversine([lat, lon], [doc.get("lat"), doc.get("lng")]) <= 2:
            return True
        return False
    except Exception as e:
        print(f"An error occurred: {e}")
        return  False

# Function decides what night activity to use
@csrf_exempt
def chooseNightActivity(night, time):
    if time > 1320:
        return night[0]
    return night[1]

# Function to get the activities type name 
@csrf_exempt
def processString(string):
    # Relace underscores
    string = string.replace("_", " ")
    word = string.split()
    if word:
        # remove the serves part of the activity
        if word[0] == "serves":
            return word[1]
        string = " ".join(word)
    return string