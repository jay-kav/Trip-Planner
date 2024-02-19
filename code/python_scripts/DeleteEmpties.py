from pymongo import MongoClient

# Connect to mongodb
client = MongoClient(get_env_value('ADMIN_URL'))
database = client["Belgium"]
collection = database[""]

# Query for documents where opening_times is an empty array
query = {"opening_times": {"$exists": True, "$eq": []}}

# Remove documents that match the query
result = collection.delete_many(query)

# Print the number of documents removed
print(f"Number of documents removed: {result.deleted_count}")