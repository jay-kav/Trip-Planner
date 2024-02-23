import random
from pymongo import MongoClient
from django.shortcuts import get_object_or_404
from .function4 import haversine

"""
Todo

Add in time map dict 
add foodapicall
add haversine

"""

time_to_spend = {
    "shopping_mall": 240,
    "park": 120,
    "museum": 120,
    "amusement_park": 36,
    "zoo": 240,
    "bar": 90,
    "bowling_alley": 90, 
    "night_club": 180,
    "casino": 240,
    "aquarium": 180

}


def apiCall(location, time, types, trip_id, day, activities, previous):
    # client = MongoClient(get_env_value('MONGO_URL'))
    MONGO_URL = 'mongodb+srv://testUser:LL0TlwSJy97L4v41@cluster0.rvgahvn.mongodb.net/?retryWrites=true&w=majority'
    client = MongoClient(MONGO_URL)
    db = client[location[0]]
    collection = db[location[1]]

    #trip = get_object_or_404(Trip, id=trip_id)

    if previous:
        lat, lon = get_coordinates(collection, previous)
    else : 
        # lon, lat = get_coordinates(collection, location[2])
        lat, lon = location[2]

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
            "$maxDistance": 2000 
        }
    }
}

    documents = collection.find(query)

    random.shuffle(documents)

    for doc in documents:
        name = doc.get("name")
        #if name not in trip.activities() and name not in activities:
        if name not in activities:
            doc_location = doc.get("geometry", {}).get("location", {})
            distance = haversine([lat,lon], [doc_location.get("lat"), doc_location.get("lon") ])
            walkTime = (distance * 12) 
            walkTime = time - (time % 5) + 5

            start_time = time + walkTime
            types = doc.get("types", {})
            
            endTime = start_time + time_to_spend[types]

            time_range = doc.get("cleaned_times")[day]
            open_time, closed_time = map(int, time_range.split('-'))

            if open_time <= start_time and endTime <= (closed_time - 20):
                if endTime > closed_time:
                    endTime -= (endTime - closed_time)
                return doc.get('name'), start_time, endTime




def get_coordinates(collection, place_name):    

    # Query for the document with the given place name
    result = collection.find_one({"name": place_name})

    if result:
        # Extract latitude and longitude
        location = result.get("geometry", {}).get("location", {})
        latitude = location.get("lat")
        longitude = location.get("lng")

        return latitude, longitude
    else:
        return None