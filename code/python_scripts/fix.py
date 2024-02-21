from pymongo import MongoClient


client = MongoClient(get_env_value('MONGO_URL'))
db = client['Belgium']
# collection = db['Brussels']
# collection = db['Antwerp']

# Ensures data has been transfered to local database
query = {"types": "hotel"}

docs = collection.find(query)

for doc in docs:
    name = doc.get("name")
    print(name)

# Create a 2dsphere index
collection.create_index([("geometry.location", "2dsphere")])
