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

@csrf_exempt
def createTrip(request):
    if request.method == 'POST':
        try:
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
            members.append(owner_id)
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
            print(form_data)
            
            form = TripForm(data=form_data)
            if form.is_valid():
                if form.save():
                    return JsonResponse({'detail': 'Successfully created new trip'})
                print(form.errors)
                return JsonResponse({'error': 'Failed to create trip'}, status=400)
            else:
                print(form.errors)
            return JsonResponse({'error': 'Failed to create trip'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid request method'}, status=405)
        
@csrf_exempt
def getCountries(request):
    if request.method == 'POST':
        MONGO_URL = os.getenv('MONGO_URL')
        client = MongoClient(MONGO_URL)
        pattern = r"^[A-Z]"

        regex = re.compile(pattern)
        my_list = client.list_database_names()
        countries = [item for item in my_list if regex.match(item)]
        return JsonResponse({'detail': 'Successfully retrieved countries', 'countries': countries}, status=200)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def getCities(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            country = data.get('country')
            if not country:
                return JsonResponse({'detail': 'No country selected', 'cities': []}, status=200)

            client = MongoClient(get_env_value('MONGO_URL'))
            db = client[country]
            my_list = db.list_collection_names()

            pattern = r"^[A-Z]"
            regex = re.compile(pattern)

            cities = [item for item in my_list if regex.match(item)]
            return JsonResponse({'detail': 'Successfully retrieved cities', 'cities': cities}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid request method'}, status=405)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def getHotel(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            country = data.get('country')
            city = data.get('city')
            hotel = data.get('hotel')
            if not country or not city:
                return JsonResponse({'detail': 'No country or city or hotel selected', 'hotel': []}, status=200)
            
            client = MongoClient(get_env_value('MONGO_URL'))
            db = client[country]
            collection = db[city]
            hotel = collection.find_one({"place_id": hotel})
            name = hotel.get("name")

            return JsonResponse({'detail': 'Successfully retrieved hotel', 'hotel': name}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid request method'}, status=405)
    return JsonResponse({'error': 'Invalid request method'}, status=405)
        

@csrf_exempt
def getHotels(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            country = data.get('country')
            city = data.get('city')
            if not country or not city:
                return JsonResponse({'detail': 'No country or city selected', 'hotels': []}, status=200)

            client = MongoClient(get_env_value('MONGO_URL'))
            db = client[country]
            collection = db[city]

            hotels = collection.find({"types": "hotel"})
            hotels_names = []
            for hotel in hotels:
                name = hotel.get("name")
                id = hotel.get("place_id")
                hotels_names.append({'id': id, 'name': name})
            return JsonResponse({'detail': 'Successfully retrieved hotels', 'hotels': hotels_names}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid request method'}, status=405)
    return JsonResponse({'error': 'Invalid request method'}, status=405)
        
@csrf_exempt
def deleteTrip(request):
    if request.method == 'POST' :
        try:
            data = json.loads(request.body)
            trip_id = data.get('tripID')
            trip = get_object_or_404(Trip, id=trip_id)
            if trip.delete():
                return JsonResponse({'detail': 'Successfully deleted Trip'})
            else:
                return JsonResponse({'error': 'Could not delete Trip'})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid request method'}, status=405)

        
        
    """ ------------------------- Itinerary Functions ------------------------- """


@csrf_exempt
def deleteItinerary(request):
    if request.method == 'POST' :
        try:
            data = json.loads(request.body)
            print(data)
            itinerary_id = data.get('itineraryID')
            activities = data.get('activities')
            trip_id = data.get('tripID')
            result = [item.split(";")[0] for item in activities]
            itinerary = get_object_or_404(Itinerary, id=itinerary_id)
            if itinerary.delete():
                deleteActivities(trip_id, result)
                return JsonResponse({'detail': 'Successfully deleted itinerary'})
            else:
                return JsonResponse({'error': 'Unable to delete itinerary'})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid request method'}, status=405)
        

    """ ------------------------- Member Functions ------------------------- """

@csrf_exempt
def addMembers(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)
            trip_id = data.get('tripID')
            member_ids = data.get('memberIDs', [])
            print(member_ids)

            trip = get_object_or_404(Trip, id=trip_id)

            for member_id in member_ids:
                member_to_add = get_object_or_404(User, id=member_id)
                if member_to_add not in trip.members.all():
                    trip.members.add(member_to_add)
                else:
                    return JsonResponse({'error': 'Member already in the trip members list'}, status=400)
            return JsonResponse({'detail': 'Successfully added a member'})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def removeMember(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)
            print("here")
            trip_id = data.get('tripID')
            member_id = data.get('memberID')

            trip = get_object_or_404(Trip, id=trip_id)

            if member_id:
                member_to_remove = get_object_or_404(User, id=member_id)
                if member_to_remove in trip.members.all():
                    trip.members.remove(member_to_remove)
                    return JsonResponse({'detail': 'Successfully removed member'})
                else:
                    return JsonResponse({'error': 'Member not found in the trip members list'}, status=400)
            else:
                return JsonResponse({'error': 'Invalid member data'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid request method'}, status=405)

logger = logging.getLogger(__name__)

@csrf_exempt
def changeOwner(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)
            trip_id = data.get('tripID')
            member_id = data.get('memberID')
            member = get_object_or_404(User, id=member_id)

            trip = get_object_or_404(Trip, id=trip_id)
            new_owner = get_object_or_404(User, id=member_id)

            if new_owner:
                trip.owner = new_owner
                trip.save()
                return JsonResponse({'detail': 'Successfully changed owner'})
            return JsonResponse({'error': 'Member not found'}, status=400)
        except json.JSONDecodeError as e:
            logger.error(f"JSON decoding error: {e}")
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
            
    """ ------------------------- Activity Functions ------------------------- """
 
@csrf_exempt
def deleteActivities(trip_id, remove = []):
    trip = get_object_or_404(Trip, id=trip_id)

    if trip:
        if remove:
            trip.activities = [activity for activity in trip.activities if activity not in remove]
            if trip.save():
                return JsonResponse({'detail': 'Successfully deleted activities'})
        else:
            return JsonResponse({'detail': 'Successful without deletion'})
        return JsonResponse({'error': 'Invalid activities data or activities not found'}, status=400)
    return JsonResponse({'error': 'Trip not found'}, status=404)
    
@csrf_exempt
def clearActivities(request):
    try:
        data = json.loads(request.body)
        trip_id = data.get('tripID')
        print(trip_id)
        trip = get_object_or_404(Trip, id=trip_id)

        if trip:
            trip.activities = []
            trip.save()
            return JsonResponse({'detail': 'Successfully cleared activities'}, status=200)
        return JsonResponse({'error': 'Trip not found'}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
        
    
@csrf_exempt
def getActivities(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            activities = data.get('activities')
            country = data.get('country')
            city = data.get('city')

            MONGO_URL = os.getenv('MONGO_URL')
            client = MongoClient(MONGO_URL)
            db = client[country]
            collection = db[city]

            list_of_places = [s.split(";") for s in activities]
            print(f"places list {list_of_places}")

            def getID(activity):
                return activity.split(";")[0]
        

            def getTime(time):
                hours = time // 60
                minutes = time % 60
                return f"{str(hours).zfill(2)}:{str(minutes).zfill(2)}"
        

            place_ids = list(map(getID, activities))

            places = list(collection.find({"place_id": {"$in": place_ids}}))

            activityList = []
            for details in list_of_places:
                found = False
                for place in places:
                    print(f"details {details}")
                    id = place.get("place_id", "")
                    if details[0] != id or found:
                        continue

                    found = True

                    start_times = getTime(int(details[1]))
                    end_times = getTime(int(details[2]))
                    image_data = place.get("image_data", None)
                    type = details[3]

                    # Check if image data is available
                    if image_data:
                        # Convert binary image data to base64 https://bobbyhadz.com/blog/convert-image-to-base64-string-in-python

                        encoded_image = base64.b64encode(image_data).decode('utf-8')
                        # print("Successful")
                    else:
                        encoded_image = None
                    address = place.get("formatted_address", "")
                    name = place.get("name", "")
                    rating = place.get("rating", "")
                    url = place.get("url", "")
                    website = place.get("website", "")
                    location = place.get("geometry", {}).get("location", {})
                    latitude = location.get("lat")
                    longitude = location.get("lng")
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
        
@csrf_exempt
def getImage(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            country = data.get('country')
            city = data.get("city")
            if not country or not city:
                return JsonResponse({'error': 'Country or City missing'}, status=404)
            
            client = MongoClient(get_env_value('MONGO_URL'))
            db = client[country]
            collection = db["images"]
            document = collection.find_one({"name": city})
            if document:

                image_data = document.get("image")

                # Open the image using Pillow
                image = Image.open(BytesIO(image_data))

                # Convert the image to a base64-encoded string
                buffered = BytesIO()
                image.save(buffered, format="JPEG")  # You can adjust the format as needed
                image_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")

                return JsonResponse({'detail': 'successfully retrieved image', 'image_base64': image_base64}, status=200)
            
            return JsonResponse({'error': 'Image not found'}, status=404)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid request method'}, status=405)