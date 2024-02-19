from pymongo import MongoClient

# Connect to the MongoDB cluster
client = MongoClient(get_env_value('ADMIN_URL'))
db = client['Belgium']
collection = db['']

db = client['Belgium']
dcollection = db["anomalies"]

# Query the database for documents that have the opening_times field
cursor = collection.find({"opening_times": {"$exists": True}})

# Update the documents in the collection
for document in cursor:
    product_id = document.get("place_id")
    opening_times = document.get("opening_times", [])  # Fetch the opening_times array

    # Process each entry in the array
    cleaned_times = []
    try:
        for entry in opening_times:
            result = entry.replace('\u202f', ' ').replace('\u2009', ' ') # Replace all the special characters
            result = result.replace('12:00 AM', '24:00 AM') # Change around the times to comply with the logic below
            result = result.replace('12:30 AM', '24:30 AM')
            result = result.replace('12:45 AM', '24:45 AM')
            result = result.replace('12:15 AM', '24:15 AM')
            result = result.replace('12:00 PM', '12:00 AM')
            result = result.replace('12:30 PM', '12:30 AM')
            result = result.replace('12:45 PM', '12:45 AM')
            result = result.replace('12:15 PM', '12:15 AM')
            
            result = result.split(":") # Split the opening and closing time
            result = result[1:] # Remove the day at the beginning

            if len(result) > 1: # Make sure the index isn't empty arent empty
                # Process the index 
                result = ' '.join(result)
                print(result)
                result = result.replace('AM', '0').replace('PM', '12').replace('–', '') # Replace AM and PM with the digital clock time 
                print(result)
                result = result.split(' ') # Split the string buy its space
                print(result)
                
                # Adjust the time values
                if len(result) == 8: # Check the string follows googles formatiing
                    r1 = result[1:4] # Opening time
                    r2 = result[5: ] # Closing time
                    
                    r1[0] = str(int(r1[0]) + int(r1[2])) # Add the time by the number replaced by AM or PM
                    r1 = ':'.join(r1[:2]) # Join the hours and minutes
                    r2[0] = str(int(r2[0]) + int(r2[2])) # Add the time by the number replaced by AM or PM
                    r2 = ':'.join(r2[:2]) # Join the hours and minutes
                    
                    result = r1 + "-" + r2 # Concatinate the string back together

                else: # If the time follows googles second formating style
                    r1 = result[1:3] # Opening time
                    r2 = result[4: ] # Closing time
                    
                    if r1[0] == "12":
                        r1 = ':'.join(r1) # Join the hours and minutes
                        r2[0] = str(int(r2[0]) + int(r2[2])) # Add the time by the number replaced by AM or PM
                        r2 = ':'.join(r2[:2]) # Join the hours and minutes
                        
                    else:
                        r1[0] = str(int(r1[0]) + 12)
                        r1 = ':'.join(r1) # Join the hours and minutes
                        r2[0] = str(int(r2[0]) + int(r2[2])) # Add the time by the number replaced by AM or PM
                        r2 = ':'.join(r2[:2]) # Join the hours and minutes
                        
                    
                    result = r1 + "-" + r2 # Concatinate the string back together
                

            else: # Index isn't a time insead it is "closed"
                result = result[0].replace(' ', '') # Replaces spaces

            # Append the processed entry to the cleaned_times list
            cleaned_times.append(result)

        # Update the document in the collection with the new values
        #print(cleaned_times)
        collection.update_one(
            {"place_id": product_id},
            {"$set": {"cleaned_times": cleaned_times}}
        )
    except Exception as e:
        # If an exception occur move the document to a different collection
        print(f"Error document {product_id}: {str(e)}")
        dcollection.insert_one(document)
        collection.delete_one({"place_id": product_id})


# Close the MongoDB connection
client.close()
