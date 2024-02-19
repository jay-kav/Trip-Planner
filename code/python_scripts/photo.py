import requests
from pymongo import MongoClient
from bson import Binary

# MongoDB connection
client = MongoClient(get_env_value('ADMIN_URL'))
database = client["Belgium"]
collection = database[""]

# Iterate through all documents in the collection
for document in collection.find({"photos": {"$exists": True, "$ne": []}}, {"_id": 1, "photos": {"$slice": 1}}):
    place_id = document["_id"]
    photos = document.get("photos", [])

    # Ensure photo exists
    if photos:
        # Fetch the reference from the document
        photo_reference = photos[0].get("photo_reference")

        # https://developers.google.com/maps/documentation/places/web-service/photos how to get a image from google places api
        photo_url = f"https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference={photo_reference}&key={get_env_value('GAPI_KEY')}"

        # Make a request to download the photo
        response = requests.get(photo_url)

        # Check if the request was successful (status code 200)
        if response.status_code == 200:
            # https://sparkbyexamples.com/mongodb/store-images-in-the-mongodb-database/#:~:text=One%20way%20to%20store%20images,it%20as%20a%20Binary%20object.
            # How mongodb stores images
            image_data = Binary(response.content)
            # Store in image data
            collection.update_one({"_id": place_id}, {"$set": {"image_data": image_data}})
            print(f"Image data for place {place_id} saved to MongoDB.")
        else:
            print(f"Failed to download image for {place_id}")
    else:
        print(f"No photos found for place {place_id}.")

# Close the MongoDB connection
client.close()