from pymongo import MongoClient

# Connection to MongoDB
MONGO_URL = ''
client = MongoClient(MONGO_URL)
db = client['Belgium']
collection = db['Brussels']

hotel_documents = collection.find({"types": "hotel"})

# Print the names of hotels
for hotel in hotel_documents:
    print(hotel.get("name", "Name not found"))

# Close the MongoDB connection
client.close()