import googlemaps
from pymongo import MongoClient

# Connection to  Google Maps API
gmaps = googlemaps.Client(key=GAPI_KEY)

# MongoDB connection

client = MongoClient(ADMIN_URL)
db = client['Belgium']
collection = db['Brussels']

# Brussels city center coordinates
brussels_center = (50.8503, 4.3517)
radius = 10000  # Radius in meters

# List of types for places
place_types = [
    'museum',
    'shopping_mall',
    'park',
    'night_club',
    'point_of_interest',
    'tourist_attraction',
    'cafe',
    'bar',
    'restaurant'
    # 'hotel'
]

# Set used to keep track of already inserted place IDs
inserted_place_ids = set()

# Nearby Place API search requests for each type
for place_type in place_types:
    places = gmaps.places_nearby(
        location=brussels_center,
        radius=radius,
        type=place_type
    )
    
    # Store fetched place data into MongoDB
    for place in places['results']:
        place_id = place['place_id']
        
        # Check if the place ID is not already in the set
        if place_id not in inserted_place_ids:
            # Add the place data into the MongoDB collection
            collection.insert_one(place)
            
            # Add the place ID to the set
            inserted_place_ids.add(place_id)
