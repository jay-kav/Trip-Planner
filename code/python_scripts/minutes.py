from pymongo import MongoClient

# Function to convert hour times to minutes
def converter(time):
    if time == "Closed" or time == "None": 
        return time
    elif time == "Open24hours": 
        return time
    else:
        time = time.replace("–", "-").replace('\u2009', '').replace('\u202f', '')
        result = time.split("-")
        t1 = result[0]
        t2 = result[1]

        r1 = t1.split(":")
        r2 = t2.split(":")

        b1 = str((int(r1[0]) * 60) + int(r1[1]))
        b2 = str((int(r2[0]) * 60) + int(r2[1]))

        return b1 + "-" + b2


# Connect to mongodb
client = MongoClient(get_env_value('ADMIN_URL'))
database = client["Belgium"]
collection = database[""]


# Query the database for documents with the cleaned_time field
cursor = collection.find({"cleaned_times": {"$exists": True}})

# Iterate through each document
for document in cursor:
    product_id = document.get("place_id")
    cleaned_times = document.get("cleaned_times", [])  # Extract the cleaned_times array


    # Process each index in the cleaned_times array
    minute_times = []
    try:
        i = 1
        for entry in cleaned_times: # Iterate each index
            result = converter(entry)
            #print(i)
            print(result)
            i += 1

            # Append the entry to the minute_times list
            minute_times.append(result)

        # Update the document in the collection with the new array
        #print(cleaned_times)
        collection.update_one(
            {"place_id": product_id},
            {"$set": {"minute_times": minute_times}}

        )

    except Exception as e:
        # If an exception occurs delete the document out of the collection
        print(f"Error document {product_id}: {str(e)}")
        #dcollection.insert_one(document)
        collection.delete_one({"place_id": product_id})


# Close the MongoDB connection
client.close()