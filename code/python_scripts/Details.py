from pymongo import MongoClient 
import googlemaps

# MongoDB connection

client = MongoClient(get_env_value('ADMIN_URL'))
db = client['Belgium']
collection = db['Add']

# Google Maps API configuration
api_key = "AIzaSyAudMNmJ-wUGoZKtx61S3mh6GhvzBMCbHM"
gmaps = googlemaps.Client(key=get_env_value('Gapi_key'))

# Iterate through each item in the MongoDB collection
# https://www.w3schools.com/python/python_mongodb_find.asp

for item in collection.find({}, {"_id": 0, "place_id": 1}):
    pace = item.get("place_id")  # Fetch the 'place_id' from the item
    
    # Place Details request to Google Maps
    place_details = gmaps.place(place_id=pace, fields=[
        "opening_hours",
        "price_level",
        "website",
        "url",
        "formatted_address",
        "serves_breakfast",
        "serves_lunch",
        "serves_dinner",
        "serves_vegetarian_food"
    ])

    # Extract required information from the response data
    if 'result' in place_details:
        result = place_details['result']
        opening_hours = result.get('opening_hours', {}).get('weekday_text', [])
        price_level = result.get('price_level')
        website = result.get('website')
        url = result.get('url')
        formatted_address = result.get('formatted_address')
        breakfast = result.get('serves_breakfast')
        lunch = result.get('serves_lunch')
        dinner = result.get('serves_dinner')
        vegetarian = result.get('serves_vegetarian_food')

        # Update the MongoDB document with the info
        update_data = {
            "opening_times": opening_hours,
            "price_level": price_level,
            "website": website,
            "url": url,
            "formatted_address": formatted_address,
            "serves_breakfast": breakfast,
            "serves_lunch": lunch,
            "serves_dinner": dinner,
            "serves_vegetarian_food": vegetarian
        }

        collection.update_one({"place_id": pace}, {"$set": update_data})

client.close()