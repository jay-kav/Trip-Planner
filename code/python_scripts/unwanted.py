from pymongo import MongoClient


#Connection to MongoDB

client = MongoClient(ADMIN_URL)
db = client['Belgium']
collection = db['Brussels']


# Set the unwanted types
unwanted_types = ["lodging", "furniture_store", "book_store", "hair_care", "parking", "jewelry_store", "grocery_or_supermarket"]

# Query to find places containing unwanted types
query = {"types": {"$in": unwanted_types}}

# Find and delete the places that contain unwanted types
removed = collection.delete_many(query)

# Print the number of deleted documents
print(f"Deleted {removed.deleted_count} documents containing unwanted types.")
