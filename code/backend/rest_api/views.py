from django_filters import rest_framework as filters
from rest_framework import viewsets
from .serializers import *
from .models import *
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, logout, login
from .forms import *
from pymongo import MongoClient
from load_env_var import get_env_value
import os
import base64
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
def createItinerary(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)
            trip_id = data.get('tripID')
            date = data.get('date')
            start = data.get('startTime')
            end = data.get('endTime')
            #filters = data.get('filters', [])
            #country = data.get('country')
            #city = data.get('city')
            #hotel = data.get('hotel')
            
            client = MongoClient(get_env_value('MONGO_URL'))
            db = client['Belgium']
            collection = db['Brussels']
            
            cursor = collection.find().limit(5)
    
            activities = []
            trip = []
            for document in cursor:
                product_id = str(document.get("place_id"))
                opening_times = str(document.get("cleaned_times", [])[0])
                
                result = product_id + ";" + opening_times
                
                trip.append(product_id)
                activities.append(result)
                
            form_data = {
                'trip_id': trip_id,
                'date': date,
                'start': start,
                'end': end,
                'activities': activities,
            }
        
            form = ItineraryForm(data=form_data)
            
            if form.is_valid():
                if form.save():
                    add_activities(trip_id, trip)
                    return JsonResponse({'detail': 'Successfully created new itnerary'})
                return JsonResponse({'error': 'Failed to create itinerary'}, status=400)
            else:
                print(form.errors)
            return JsonResponse({'error': 'Failed to create itinerary'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid request method'}, status=405)

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
                delete_activities(trip_id, result)
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
            member_ids = data.get('memberIDs')

            trip = get_object_or_404(Trip, id=trip_id)

            for member_id in member_ids:
                if member_id:
                    member_to_add = get_object_or_404(User, id=member_id)
                    if member_to_add not in trip.members.all():
                        trip.members.add(member_to_add)
                        return JsonResponse({'detail': 'Successfully added a member'})
                    else:
                        return JsonResponse({'error': 'Member already in the trip members list'}, status=400)
                else:
                    return JsonResponse({'error': 'Invalid member data'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def removeMember(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)
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
            
    """ ------------------------- Activity Functions ------------------------- """

@csrf_exempt
def deleteTrip(request):
    if request.method == 'POST':
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

@csrf_exempt
def deleteItinerary(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)
            itinerary_id = data.get('itineraryID')
            activities = data.get('activities')
            trip_id = data.get('tripID')
            result = [item.split(";")[0] for item in activities]
            itinerary = get_object_or_404(Itinerary, id=itinerary_id)
            if itinerary.delete():
                delete_activities(trip_id, result)
                return JsonResponse({'detail': 'Successfully deleted itinerary'})
            else:
                return JsonResponse({'error': 'Unable to delete itinerary'})

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid request method'}, status=405)
@csrf_exempt
def add_activities(trip_id, activities_to_add):
    trip = get_object_or_404(Trip, id=trip_id)

        # Update the activities field with multiple activities
    if activities_to_add:
        trip.activities.extend(activities_to_add)
        trip.save()
        return JsonResponse({'detail': 'Successfully added activities'})
    else:
        return JsonResponse({'error': 'Invalid activities data'}, status=400)
 
@csrf_exempt
def delete_activities(trip_id, remove = []):
    trip = get_object_or_404(Trip, id=trip_id)

    if trip:
        if remove:
            trip.activities = [activity for activity in trip.activities if activity not in remove]
            if trip.save():
                return JsonResponse({'detail': 'Successfully deleted activities'})
        else:
            return JsonResponse({'detail': 'Successful without deletion'})
        return JsonResponse({'error': 'Invalid activities data or activities not found'}, status=400)
    
@csrf_exempt
def getActivities(request):
    if request.method == 'POST':
        try:
            MONGO_URL = os.getenv('MONGO_URL')
            client = MongoClient(MONGO_URL)
            db = client['Belgium']
            collection = db['Brussels']

            data = json.loads(request.body)
            activities = data.get('activities')

            def getID(activity):
                return activity.split(";")[0]

            place_ids = list(map(getID, activities))

            places = collection.find({"place_id": {"$in": place_ids}})

            activities = []
            for place in places:
                id = place.get("place_id", "")
                image_data = place.get("image_data", None)

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
                activities.append({
                    'id': id,
                    'name': name,
                    'address': address,
                    'rating': rating,
                    'image_data': encoded_image
                })
            return JsonResponse({'detail': 'Successfully retrieved activities', 'activities': activities}, status=200)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid request method'}, status=405)

    """ ------------------------- User Authentication ------------------------- """

# Function to create a new User instance
@csrf_exempt
def registerView(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            email = data.get('email')
            password = data.get('password')

            user = User.objects.create_user(username=username, email=email, password=password)
            if user:
                return JsonResponse({'detail': 'Successfully created new user'})
            return JsonResponse({'error': 'Failed to create new user'})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

# Function to log in a User instance if it exists
@csrf_exempt
def loginView(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('username')
            password = data.get('password')
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({'detail': 'Successfully logged in', 'uid': user.pk}, status=200)   
            return JsonResponse({'error': 'Log in failed'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

# Function to log out current User
@csrf_exempt
def logoutView(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'detail': 'Successfully logged out'})
    return JsonResponse({'error': 'Invalid request method'}, status=405)

    """ ------------------------- View sets ------------------------- """
   
class UserViewset(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ['is_staff', 'id']
    queryset = User.objects.all()

class TripViewset(viewsets.ModelViewSet):
    serializer_class = TripSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ['members']
    queryset = Trip.objects.all()

class ItineraryViewset(viewsets.ModelViewSet):
    serializer_class = ItinerarySerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ['trip_id']
    queryset = Itinerary.objects.all()