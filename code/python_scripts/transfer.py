from pymongo import MongoClient
from load_env_var import get_env_value

# Connect to the MongoDB cluster


client = MongoClient(get_env_value('ADMIN_URL'))
client2 = MongoClient(get_env_value('MONGO_URL'))

# Source data and destination to be sent
source_db = client["Belgium"]
destination_db = client2["Belgium"]

source_collection = source_db["Antwerp"]
destination_collection = destination_db["Antwerp"]

# Find documents in the source collection
documents_to_transfer = source_collection.find({})

# Insert documents into destination
destination_collection.insert_many(documents_to_transfer)

# Close the MongoDB connection
client.close()