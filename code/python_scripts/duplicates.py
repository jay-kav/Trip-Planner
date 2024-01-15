from pymongo import MongoClient

# Connection to MongoDB

client = MongoClient(ADMIN_URL)
db = client['Belgium']
collection = db['Brussels']


# Function to removed duplicates
# referenced from https://studio3t.com/knowledge-base/articles/mongodb-aggregation-framework/
def remove_duplicates(collection, field_name):
    pipeline = [
        # Group IDs based on the specified field and create a set for all IDs
        # Create a counter for the occurence of all the IDs
        {"$group": {"_id": f"${field_name}", "uniqueIds": {"$addToSet": "$_id"}, "count": {"$sum": 1}}},
        # Filters out all places that occur only once 
        {"$match": {"count": {"$gt": 1}}}
    ]

    # Aggregate preforms the actions specified in pipeline
    duplicate_records = collection.aggregate(pipeline)

    for record in duplicate_records:
        unique_ids = record["uniqueIds"]
        # Delete the first occurence so that is remains in the database
        del unique_ids[0]

        # Delete duplicates
        collection.delete_many({"_id": {"$in": unique_ids}})



field_name = "place_id"  # Change to the needed field

# Sends the collection and the field to be used
remove_duplicates(collection, field_name)
