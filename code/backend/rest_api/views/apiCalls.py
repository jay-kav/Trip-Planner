from django.views.decorators.csrf import csrf_exempt
import random
from .distanceCalculator import haversine, distanceCal
from ..models import *
from django.shortcuts import get_object_or_404

# Heuristic times to spend in each activity
time_to_spend = {
    "shopping_mall": 240,
    "park": 120,
    "museum": 120,
    "food": 90,
    "tourist_attraction": 90,
    "amusement_park": 180,
    "zoo": 240,
    "bar": 90,
    "bowling_alley": 90, 
    "night_club": 180,
    "casino": 240,
    "aquarium": 180

}

# Function to query the database to find documents for a given filter
@csrf_exempt
def apiCall(toggle, collection, hotel, time, startTime, endTime, types, trip_id, day, activities=None, previous='', failed=None):

    if not activities:
        activities = []
    if not failed:
        failed = []

    # Get the associated trip
    trip = get_object_or_404(Trip, id=trip_id)
    distance = 0

    # Get the current loactions coordinates
    if previous:
        coordinates = get_coordinates(collection, previous)
    else: 
        coordinates = hotel

    # If failed to get the coordinates end the function
    if not coordinates:
        return None
    
    lat, lon = coordinates
    startLat, startLon = hotel

    # If round Trip send the locations to see the max distance they can be
    if toggle:
        # function calculates the max distance allowed for the next location 
        distance = distanceCal(time, endTime, startTime, time_to_spend[types])

    # Query fetches all documents within a 2km radius of the current location
    query = {
        "types": types,
        f"cleaned_times.{day}": {
            "$ne": "Closed"
        },
        "geometry.location": {
            "$near": {
                "$geometry": {
                    "type": "Point",
                    "coordinates": [lat, lon]
                },
                "$maxDistance": 2000  # Adjust the maximum distance in meters as needed
            }
        }
    }


    # Convert to a list
    documents = list(collection.find(query))

    # If no documents available backtrack
    if not documents:
        return None

    random.shuffle(documents)

    # Create a list of activities already done
    if trip.activities:
        usedLocations = trip.activities.copy()
    else:
        usedLocations = []
    usedLocations.extend(activities)
    usedLocations.extend(failed)

    # Iterate through the documents
    for doc in documents:
        id = doc.get("place_id")

        # Check if location is unique
        if usedLocations is None or id not in usedLocations:
            doc_location = doc.get("geometry", {}).get("location", {})
        
            docLatitude = doc_location.get("lat")
            docLongitude = doc_location.get("lng")
            
            # Ensure the location is not to far from the set distance
            if toggle and haversine([startLat, startLon], [docLatitude, docLongitude ]) > distance:
                continue
            
            # Get the exact distance the next location is away
            distance = haversine([lat,lon], [docLatitude, docLongitude])
            print(f"distance {distance}")
        
            # Calculate the walk distance
            walkTime = (distance * 12) 
            walkTime = walkTime - (walkTime % 5) + 5

            # Calculate when the activity starts
            start_time = int(time + walkTime)
            # print(start_time)
             
            # Calculate when the activity ends
            end_time = start_time + time_to_spend[types]

            # print(f"test {doc.get('name')}, {start_time}, {end_time}")
            # Check if the location is open during the times
            time_range = doc.get("minute_times")[day]
            if time_range == 'Open24hours':
                open_time, closed_time = 0, 1440
            else:
                open_time, closed_time = map(int, time_range.split('-'))

            if open_time <= start_time and end_time <= (closed_time - 20):
                if end_time > closed_time:
                    end_time -= (end_time - closed_time)
                return id, start_time, end_time
    return None

# Function to query the database to find documents for a given meal time
@csrf_exempt
def foodApiCall(toggle, collection, hotel, time, startTime, endTime,  food_type, trip_id, day, activities=None, previous=None, vegetarian=False, failed=None):
    if not activities:
        activities = []

    print(f"food api {food_type}")

    # Get the associated trip
    trip = get_object_or_404(Trip, id=trip_id)

    # Get the current loactions coordinates
    if previous:
        coordinates = get_coordinates(collection, previous)
    else : 
        coordinates = hotel

     # If failed to get the coordinates end the function
    if not coordinates:
        return None
    
    lat, lon = coordinates
    startLat, startLon = hotel

    # If round Trip send the locations to see the max distance they can be
    if toggle:
        distance = distanceCal(time, endTime, startTime, 90)
    
    # Query fetches all documents within a 2km radius of the current location based on if they serve the set meal type
    query = {
        food_type: True,
        f"cleaned_times.{day}": {
            "$ne": "Closed"
        },
        "geometry.location": {
            "$near": {
                "$geometry": {
                    "type": "Point",
                    "coordinates": [lat, lon]
                },
                "$maxDistance": 2000  # maximum distance in metres
            }
        }
    }

    # If user wants to eat vegetarian food
    if vegetarian:
        query["serves_vegetarian_food"] = True


    # Convert to a list
    documents = list(collection.find(query))

    # If no documents available backtrack
    if not documents:
        return None

    random.shuffle(documents)

    # Create a list of activities already done
    if trip.activities:
        usedLocations = trip.activities.copy()
    else:
        usedLocations = []
    usedLocations.extend(activities)
    usedLocations.extend(failed)

    # Iterate through the documents
    for doc in documents:
        id = doc.get("place_id")
        if usedLocations is None or id not in usedLocations:
            doc_location = doc.get("geometry", {}).get("location", {})
        
            docLatitude = doc_location.get("lat")
            docLongitude = doc_location.get("lng")

            # Ensure the location is not to far from the set distance
            if toggle and haversine([startLat, startLon], [docLatitude, docLongitude ]) > distance:
                continue

            # Get the exact distance the next location is away
            distance = haversine([lat,lon], [docLatitude, docLongitude ])
            print(f"distance {distance}")

            # Calculate the walk distance
            walkTime = (distance * 12) 
            walkTime = walkTime - (walkTime % 5) + 5

            # Calculate when the activity starts
            start_time = int(time + walkTime)
        
            # Calculate when the activity ends
            end_time = start_time + 90
            
            # print(f"test {doc.get('name')}, {start_time}, {end_time}")
            # Check if the location is open during the times
            time_range = doc.get("minute_times")[day]
            if time_range == 'Open24hours':
                open_time, closed_time = 0, 1440
            else:
                open_time, closed_time = map(int, time_range.split('-'))

            if open_time <= start_time and end_time <= (closed_time - 20):
                if end_time > closed_time:
                    end_time -= (end_time - closed_time)
                return id, start_time, end_time
    return None

# Function to retrieve the current locations coordinates
@csrf_exempt
def get_coordinates(collection, place_id):    

    # Query for the document with the given place name
    result = collection.find_one({"place_id": place_id})

    if result:
        # Extract latitude and longitude from the nested structure
        location = result.get("geometry", {}).get("location", {})
        latitude = location.get("lat")
        longitude = location.get("lng")

        return latitude, longitude
    else:
        return None