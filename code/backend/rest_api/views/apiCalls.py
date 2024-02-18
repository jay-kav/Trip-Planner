from django.views.decorators.csrf import csrf_exempt
import random
from pymongo import MongoClient
from load_env_var import get_env_value
from .distanceCalculator import haversine
from .dist import distanceCal
#from distanceCalculator import haversine
from ..models import *
from django.shortcuts import get_object_or_404

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

@csrf_exempt
def apiCall(toggle, collection, hotel, time, startTime, endTime, types, trip_id, day, activities=None, previous='', failed=None):

    if not activities:
        activities = []
    if not failed:
        failed = []

    trip = get_object_or_404(Trip, id=trip_id)
    distance = 0

    if previous:
        coordinates = get_coordinates(collection, previous)
    else: 
        coordinates = hotel
        print(f"this is importnat {coordinates}")

    if not coordinates:
        return None
    
    lat, lon = coordinates
    startLat, startLon = hotel
    if toggle:
        distance = distanceCal(time, endTime, startTime, time_to_spend[types])

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



    documents = list(collection.find(query))

    if not documents:
        return None

    random.shuffle(documents)


    if trip.activities:
        usedLocations = trip.activities.copy()
    else:
        usedLocations = []
    usedLocations.extend(activities)
    usedLocations.extend(failed)

    for doc in documents:
        id = doc.get("place_id")
        #if name not in trip.activities() and name not in activities:
        if usedLocations is None or id not in usedLocations:
            doc_location = doc.get("geometry", {}).get("location", {})
        
            if toggle and haversine([startLat, startLon], [doc_location.get("lat"), doc_location.get("lng")]) > distance:
                continue

            distance = haversine([lat,lon], [doc_location.get("lat"), doc_location.get("lng") ])
            print(f"distance {distance}")
            walkTime = (distance * 12) 
            walkTime = walkTime - (walkTime % 5) + 5

            start_time = int(time + walkTime)
            print(start_time)
            
            end_time = start_time + time_to_spend[types]
            print(end_time)
            print(f"test {doc.get('name')}, {start_time}, {end_time}")
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

@csrf_exempt
def foodApiCall(toggle, collection, hotel, time, startTime, endTime,  food_type, trip_id, day, activities=None, previous=None, vegetarian=False, failed=None):
    if not activities:
        activities = []

    print(f"food api {food_type}")

    trip = get_object_or_404(Trip, id=trip_id)

    if previous:
        print("This one")
        coordinates = get_coordinates(collection, previous)
    else : 
        # lon, lat = get_coordinates(collection, location[2])
        print("here")
        coordinates = hotel

    if not coordinates:
        return None
    
    lat, lon = coordinates
    startLat, startLon = hotel

    if toggle:
        distance = distanceCal(time, endTime, startTime, 90)
    
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


    if vegetarian:
        query["serves_vegetarian_food"] = True


    
    documents = list(collection.find(query))

    if not documents:
        return None

    random.shuffle(documents)

    if trip.activities:
        usedLocations = trip.activities.copy()
    else:
        usedLocations = []
    usedLocations.extend(activities)
    usedLocations.extend(failed)

    for doc in documents:
        id = doc.get("place_id")
        if usedLocations is None or id not in usedLocations:
            doc_location = doc.get("geometry", {}).get("location", {})
            print(doc_location)
            if toggle and haversine([startLat, startLon], [doc_location.get("lat"), doc_location.get("lng")]) > distance:
                continue
            distance = haversine([lat,lon], [doc_location.get("lat"), doc_location.get("lng") ])
            print(f"distance {distance}")
            walkTime = (distance * 12) 
            walkTime = walkTime - (walkTime % 5) + 5

            start_time = int(time + walkTime)
            print(start_time)
            
            end_time = start_time + 90
            print(end_time)
            print(f"test {doc.get('name')}, {start_time}, {end_time}")
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