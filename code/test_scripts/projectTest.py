from pymongo import MongoClient
import os

# Connection to MongoDB
MONGO_URL = os.getenv('MONGO_URL')
client = MongoClient(MONGO_URL)
db = client['Belgium']
collection = db['Brussels']

hotel_documents = collection.find({"place_id": {"$in": ["ChIJz_6nT2bEw0cRKZz8zOuFfy0", "ChIJXWfZ84bDw0cRzmrmGD0mF1A"]}})

# Print the names of hotels
for hotel in hotel_documents:
    #print(hotel)
    print(hotel.get("name", "Name not found"))

# Close the MongoDB connection
client.close()