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

@csrf_exempt
def cApiCall(location, time, startTime, endTime, types, trip_id, day, activities=None, previous='', failed=None):

    if not activities:
        activities = []
    if not failed:
        failed = []
    client = MongoClient(get_env_value('MONGO_URL'))
    db = client[location[0]]
    collection = db[location[1]]

    trip = get_object_or_404(Trip, id=trip_id)

    if previous:
        coordinates = get_coordinates(collection, previous)
    else : 
        # lon, lat = get_coordinates(collection, location[2])
        coordinates = location[2]

    if not coordinates:
        return None
    
    lat, lon = coordinates
    startLat, startLon = location[2]

    distance = distanceCal(time, endTime, startTime, time_to_spend[types])

    query = {
        "types": {
            "$in": types
        },
        "$and": [
            {
                f"cleaned_times.{day}": {
                    "$ne": "Closed"
                },
                "geometry.location": {
                    "$near": {
                        "$geometry": {
                            "type": "Point",
                            "coordinates": [lat, lon]
                        },
                        "$maxDistance": 2000  # maximum distance in meters 
                    }
                }
            },
            {
                "geometry.location": {
                    "$near": {
                        "$geometry": {
                            "type": "Point",
                            "coordinates": [startLat, startLon]
                        },
                        "$maxDistance": distance  # maximum distance in meters
                    }
                }
            }
        ]
    }

    documents = list(collection.find(query))

    if not documents:
        return None

    random.shuffle(documents)
    activities.extend(trip.activities)
    usedLocations = activities.extend(failed)

    if not usedLocations:
        usedLocations = []

    for doc in documents:
        id = doc.get("place_id")
        #if name not in trip.activities() and name not in activities:
        if id not in usedLocations:
            doc_location = doc.get("geometry", {}).get("location", {})
            print(doc_location)
            distance = haversine([lat,lon], [doc_location.get("lat"), doc_location.get("lng") ])
            print(f"distance {distance}")
            walkTime = (distance * 12) 
            walkTime = walkTime - (walkTime % 5) + 5

            start_time = int(time + walkTime)
            print(start_time)
            
            endTime = start_time + time_to_spend[types]
            print(endTime)
            print(f"test {doc.get('name')}, {start_time}, {endTime}")
            time_range = doc.get("minute_times")[day]
            if time_range == 'Open24hours':
                open_time, closed_time = 0, 1440
            else:
                open_time, closed_time = map(int, time_range.split('-'))

            if open_time <= start_time and endTime <= (closed_time - 20):
                if endTime > closed_time:
                    endTime -= (endTime - closed_time)
                return id, start_time, endTime
    return None

@csrf_exempt
def foodApiCall(location, time, startTime, endTime,  food_type, trip_id, day, activities=None, previous=None, vegetarian=False, failed=None):
    if not activities:
        activities = []
    # client = MongoClient(get_env_value('MONGO_URL'))
    client = MongoClient(MONGO_URL)
    db = client[location[0]]
    collection = db[location[1]]
    print(f"food api {food_type}")

    trip = get_object_or_404(Trip, id=trip_id)

    if previous:
        coordinates = get_coordinates(collection, previous)
    else : 
        # lon, lat = get_coordinates(collection, location[2])
        coordinates = location[2]

    if not coordinates:
        return None
    
    lat, lon = coordinates

    distance = distanceCal(time, endTime, startTime, 90)
    
    query = {
        "types": {
            "$in": types
        },
        "$and": [
            {
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
                        "$maxDistance": 2000  # Maximum distance in meters
                    }
                }
            },
            {
                "geometry.location": {
                    "$near": {
                        "$geometry": {
                            "type": "Point",
                            "coordinates": [startLat, startLon]
                        },
                        "$maxDistance": distance  # Maximum distance in meters
                    }
                }
            }
        ]
    }

    if vegetarian:
        query["serves_vegetarian_food"] = True

    
    documents = list(collection.find(query))

    if not documents:
        return None

    random.shuffle(documents)
    activities.extend(trip.activities)
    usedLocations = activities.extend(failed)

    if not usedLocations:
        usedLocations = []

    for doc in documents:
        name = doc.get("name")
        #if name not in trip.activities() and name not in activities:
        if name not in usedLocations:
            doc_location = doc.get("geometry", {}).get("location", {})
            print(doc_location)
            distance = haversine([lat,lon], [doc_location.get("lat"), doc_location.get("lng") ])
            print(f"distance {distance}")
            walkTime = (distance * 12) 
            walkTime = walkTime - (walkTime % 5) + 5

            start_time = time + walkTime
            print(start_time)
            
            endTime = start_time + 90
            print(endTime)
            print(f"test {doc.get('name')}, {start_time}, {endTime}")
            time_range = doc.get("minute_times")[day]
            if time_range == 'Open24hours':
                open_time, closed_time = 0, 1440
            else:
                open_time, closed_time = map(int, time_range.split('-'))

            if open_time <= start_time and endTime <= (closed_time - 20):
                if endTime > closed_time:
                    endTime -= (endTime - closed_time)
                return name, start_time, endTime
    return None