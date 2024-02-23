from ..serializers import *
from ..models import *
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.models import User
from ..forms import *
from pymongo import MongoClient
from load_env_var import get_env_value
import os
from PIL import Image
from io import BytesIO
import base64
import logging
import re

# Function to create a trip
@csrf_exempt
def createTrip(request):
    if request.method == 'POST':
        try:
            # Extract Json data
            data = json.loads(request.body)
            owner_id = data.get('ownerID')
            trip_name = data.get('tripname')
            country = data.get('country')
            city = data.get('city')
            hotel = data.get('hotel')
            start_date = data.get('startDate')
            end_date = data.get('endDate')
            members = data.get('members')
            if not members:
                members = []
            else:
                members = members.split(",")
            # Add the owner to the members list
            members.append(owner_id)
            # Format the data for Trip Form 
            form_data = {
                'owner': owner_id,
                'tripname': trip_name,
                'country': country,
                'city': city,
                'hotel': hotel,
                'startDate': start_date,
                'endDate': end_date,
                'members': members,
            }
            # print(form_data)
            # Submit the form
            form = TripForm(data=form_data)
            if form.is_valid():
                # If form is valid save
                if form.save():
                    return JsonResponse({'detail': 'Successfully created new trip'})
                print(form.errors)
                return JsonResponse({'error': 'Failed to create trip'}, status=400)
            else:
                print(form.errors)
            return JsonResponse({'error': 'Failed to create trip'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid request method'}, status=405)

# Function to find all available Countries      
@csrf_exempt
def getCountries(request):
    if request.method == 'POST':
        # Connect to mongodb
        MONGO_URL = os.getenv('MONGO_URL')
        client = MongoClient(MONGO_URL)
        # Make sure the databases start with a capatalised letter
        pattern = r"^[A-Z]"


        regex = re.compile(pattern)
        my_list = client.list_database_names()
        # Return the databases that are available and capitalised
        countries = [item for item in my_list if regex.match(item)]
        return JsonResponse({'detail': 'Successfully retrieved countries', 'countries': countries}, status=200)
    return JsonResponse({'error': 'Invalid request method'}, status=405)


# Function to find all available cities
@csrf_exempt
def getCities(request):
    if request.method == 'POST':
        try:
            # Get the name of the country to be visited
            data = json.loads(request.body)
            country = data.get('country')
            # Raise error if there is no country
            if not country:
                return JsonResponse({'detail': 'No country selected', 'cities': []}, status=200)

            # connect to mongodb
            client = MongoClient(get_env_value('MONGO_URL'))
            db = client[country]
            # Get all collections avalable
            my_list = db.list_collection_names()

            # Search for only the ones that are capatalised
            pattern = r"^[A-Z]"
            regex = re.compile(pattern)

            # Keep the collections that are capitalised
            cities = [item for item in my_list if regex.match(item)]
            return JsonResponse({'detail': 'Successfully retrieved cities', 'cities': cities}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid request method'}, status=405)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

# Function to get the selected hotels information
@csrf_exempt
def getHotel(request):
    if request.method == 'POST':
        try:
            # Extract the data
            data = json.loads(request.body)
            country = data.get('country')
            city = data.get('city')
            hotel = data.get('hotel')
            # Error if data is missing
            if not country or not city:
                return JsonResponse({'detail': 'No country or city or hotel selected', 'hotel': []}, status=200)
            # connect to mongodb
            client = MongoClient(get_env_value('MONGO_URL'))
            db = client[country]
            collection = db[city]
            hotel = collection.find_one({"place_id": hotel})
            # Get the hotels name and location
            name = hotel.get("name")
            long = hotel.get("geometry").get("location").get("lng")
            lat = hotel.get("geometry").get("location").get("lat")

            return JsonResponse({'detail': 'Successfully retrieved hotel', 'name': name, 'long': long, 'lat': lat}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid request method'}, status=405)
    return JsonResponse({'error': 'Invalid request method'}, status=405)        

# Function to find all hotels in a selected city
@csrf_exempt
def getHotels(request):
    if request.method == 'POST':
        try:
            # Extract data
            data = json.loads(request.body)
            country = data.get('country')
            city = data.get('city')
            # Check the city and country where passed
            if not country or not city:
                return JsonResponse({'detail': 'No country or city selected', 'hotels': []}, status=200)

            # Connect to mongodb
            client = MongoClient(get_env_value('MONGO_URL'))
            db = client[country]
            collection = db[city]

            # Find all hotels
            hotels = collection.find({"types": "hotel"})
            hotels_names = []
            # Get the name and id of all the hotels
            for hotel in hotels:
                name = hotel.get("name")
                id = hotel.get("place_id")
                hotels_names.append({'id': id, 'name': name})
            return JsonResponse({'detail': 'Successfully retrieved hotels', 'hotels': hotels_names}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid request method'}, status=405)
    return JsonResponse({'error': 'Invalid request method'}, status=405)
    
# Function deletes a trip
@csrf_exempt
def deleteTrip(request):
    if request.method == 'POST' :
        try:
            # Extract the information
            data = json.loads(request.body)
            # Get the trip object
            trip_id = data.get('tripID')
            trip = get_object_or_404(Trip, id=trip_id)
            # Delete the trip
            if trip.delete():
                return JsonResponse({'detail': 'Successfully deleted Trip'})
            else:
                return JsonResponse({'error': 'Could not delete Trip'})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid request method'}, status=405)

        
        
    """ ------------------------- Itinerary Functions ------------------------- """

# Function to delete an Itinerary
@csrf_exempt
def deleteItinerary(request):
    if request.method == 'POST' :
        try:
            # Extract the required information
            data = json.loads(request.body)
            # print(data)
            itinerary_id = data.get('itineraryID')
            activities = data.get('activities')
            trip_id = data.get('tripID')
            result = [item.split(";")[0] for item in activities]
            # Get the itinerary object
            itinerary = get_object_or_404(Itinerary, id=itinerary_id)
            # Delete it
            if itinerary.delete():
                # called delete activities to remove the activities from the associated trip
                deleteActivities(trip_id, result)
                return JsonResponse({'detail': 'Successfully deleted itinerary'})
            else:
                return JsonResponse({'error': 'Unable to delete itinerary'})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid request method'}, status=405)
        

    """ ------------------------- Member Functions ------------------------- """

# Function to add memebers to a trip
@csrf_exempt
def addMembers(request):
    if request.method == 'POST':
        try:
            # Extract the data from the json respone
            data = json.loads(request.body)
            # print(data)
            trip_id = data.get('tripID')
            member_ids = data.get('memberIDs', [])
            # print(member_ids)

            # Get the trip object
            trip = get_object_or_404(Trip, id=trip_id)

            # Iterate through all the members
            for member_id in member_ids:
                # Get the user object associated to the member
                member_to_add = get_object_or_404(User, id=member_id)
                if member_to_add not in trip.members.all():
                    # If the user exists add to the trip object
                    trip.members.add(member_to_add)
                else:
                    return JsonResponse({'error': 'Member already in the trip members list'}, status=400)
            return JsonResponse({'detail': 'Successfully added a member'})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid request method'}, status=405)

# Function to remove a member from a trip
@csrf_exempt
def removeMember(request):
    if request.method == 'POST':
        try:
            # Get information from json response
            data = json.loads(request.body)
            # print(data)
            # print("here")
            trip_id = data.get('tripID')
            member_id = data.get('memberID')

            # Get trip onject
            trip = get_object_or_404(Trip, id=trip_id)

            # Check there is a member id sent
            if member_id:
                # If true get the corrisponding User object 
                member_to_remove = get_object_or_404(User, id=member_id)
                # Check is the user part of the trip
                if member_to_remove in trip.members.all():
                    # If so remove them
                    trip.members.remove(member_to_remove)
                    return JsonResponse({'detail': 'Successfully removed member'})
                else:
                    return JsonResponse({'error': 'Member not found in the trip members list'}, status=400)
            else:
                return JsonResponse({'error': 'Invalid member data'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid request method'}, status=405)

logger = logging.getLogger(__name__)

# Function to change the owner of a trip
@csrf_exempt
def changeOwner(request):
    if request.method == 'POST':
        try: 
            # Get the needed information from the json response
            data = json.loads(request.body)
            # print(data)
            trip_id = data.get('tripID')
            member_id = data.get('memberID')

            # Get the trip object
            trip = get_object_or_404(Trip, id=trip_id)
            # Get the new owners User object
            new_owner = get_object_or_404(User, id=member_id)

            if new_owner:
                # Check the ownership has been transfered
                trip.owner = new_owner
                trip.save()
                return JsonResponse({'detail': 'Successfully changed owner'})
            return JsonResponse({'error': 'Member not found'}, status=400)
        except json.JSONDecodeError as e:
            logger.error(f"JSON decoding error: {e}")
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
            
    """ ------------------------- Activity Functions ------------------------- """
 
# Function to delete activities from a trip
@csrf_exempt
def deleteActivities(trip_id, remove = []):
    
    # Get the associated Trip object
    trip = get_object_or_404(Trip, id=trip_id)

    if trip:
        # Check if there is any activity to remove
        if remove:
            # Keep the activities that aren't in remove
            trip.activities = [activity for activity in trip.activities if activity not in remove]
            # Save the trip object
            if trip.save():
                return JsonResponse({'detail': 'Successfully deleted activities'})
        else:
            return JsonResponse({'detail': 'Successful without deletion'})
        return JsonResponse({'error': 'Invalid activities data or activities not found'}, status=400)
    return JsonResponse({'error': 'Trip not found'}, status=404)
    
# Function to clear all activities from a trip
@csrf_exempt
def clearActivities(request):
    try:
        # Extract the required information
        data = json.loads(request.body)
        trip_id = data.get('tripID')
        # print(trip_id)
        # Get the trip object
        trip = get_object_or_404(Trip, id=trip_id)

        if trip:
            # Set the trips attribute activities to an empty list
            trip.activities = []
            trip.save()
            return JsonResponse({'detail': 'Successfully cleared activities'}, status=200)
        return JsonResponse({'error': 'Trip not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
        

# Function to get all the information for activities stored in an itinerary    
@csrf_exempt
def getActivities(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            # Extract the required information
            activities = data.get('activities')
            country = data.get('country')
            city = data.get('city')

            # Connect to mongodb
            MONGO_URL = os.getenv('MONGO_URL')
            client = MongoClient(MONGO_URL)
            db = client[country]
            collection = db[city]

            # split the list of strings to a list of a list of strings
            list_of_places = [s.split(";") for s in activities]
           #  print(f"places list {list_of_places}")

            # function to get the activities id
            def getID(activity):
                return activity.split(";")[0]
        
            # Convert time in minutes to a digital clock representation
            def getTime(time):
                hours = time // 60
                minutes = time % 60
                return f"{str(hours).zfill(2)}:{str(minutes).zfill(2)}"
        
            # Get a list of all the IDs
            place_ids = list(map(getID, activities))

            # Query the database to return all the documents for each id in the place_ids list
            places = list(collection.find({"place_id": {"$in": place_ids}}))


            activityList = []
            # For each list in the list of lists
            for details in list_of_places:
                found = False
                # For each document returned from the database
                for place in places:
                    # print(f"details {details}")
                    id = place.get("place_id", "")

                    # Match each document to its ID or skip to the next
                    if details[0] != id or found:
                        continue
                    
                    # Match found  if past the if statement
                    found = True

                    # Call function to convert times
                    start_times = getTime(int(details[1]))
                    end_times = getTime(int(details[2]))
                    image_data = place.get("image_data", None)
                    # Get the type of activity
                    type = details[3]

                    # Check if image data is available
                    if image_data:
                        # Convert binary image data to base64 https://bobbyhadz.com/blog/convert-image-to-base64-string-in-python

                        encoded_image = base64.b64encode(image_data).decode('utf-8')
                        # print("Successful")
                    else:
                        # Could not get an image
                        encoded_image = None
                    # Format the response to be sent 
                    address = place.get("formatted_address", "")
                    name = place.get("name", "")
                    rating = place.get("rating", "")
                    url = place.get("url", "")
                    website = place.get("website", "")
                    location = place.get("geometry", {}).get("location", {})
                    latitude = location.get("lat")
                    longitude = location.get("lng")

                    # All info to be displayed on the frontend

                    activityList.append({
                        'id': id,
                        'name': name,
                        'startTimes': start_times,
                        'endTimes': end_times,
                        'type': type.title(),
                        'address': address,
                        'rating': rating,
                        'image_data': encoded_image,
                        'url': url,
                        'website': website,
                        'latitude': latitude,
                        'longitude': longitude
                    })
            return JsonResponse({'detail': 'Successfully retrieved activities', 'activities': activityList, }, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid request method'}, status=405)