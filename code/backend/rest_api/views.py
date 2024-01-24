from django.shortcuts import render, redirect
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

# User Authentication
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

@csrf_exempt
def logoutView(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'detail': 'Successfully logged out'})
    return JsonResponse({'error': 'Invalid request method'}, status=405)

def index(request):
    if request.method == 'POST':
        form = TestPullForm(request.POST)
        if form.is_valid():
            # Check the value of the hidden field to identify the button click
            if form.cleaned_data['submit_button'] == 'test_pull':
                # Call your testPull function or logic here
                createItinerary(request)
                # Redirect to the index page or another page
                return redirect('index')

    else:
        form = TestPullForm()

    return render(request, 'index.html', {'form': form})

def successPage (request):
    return render(request, 'success.html')

@csrf_exempt
def createTrip(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            owner_id = data.get('ownerID')
            trip_name = data.get('tripname')
            location = data.get('location')
            start_date = data.get('startDate')
            end_date = data.get('endDate')
            members = data.get('members')
            form_data = {
                'owner': owner_id,
                'tripname': trip_name,
                'location': location,
                'startDate': start_date,
                'endDate': end_date,
                'members': members
            }
            
            form = TripForm(data=form_data)
            if form.is_valid():
                if form.save():
                    return JsonResponse({'detail': 'Successfully created new trip'})
                return JsonResponse({'error': 'Failed to create trip'}, status=400)
            else:
                print(form.errors)
            return JsonResponse({'error': 'Failed to create trip'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid request method'}, status=405)

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
def addMember(request):
    pass    

@csrf_exempt
def removeMember(request):
    pass

@csrf_exempt
def deleteTrip(request):
    pass

@csrf_exempt
def deleteItinerary(request):
    pass

# Viewsets
class UserViewset(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

class TripViewset(viewsets.ModelViewSet):
    serializer_class = TripSerializer
    queryset = Trip.objects.all()

class ItineraryViewset(viewsets.ModelViewSet):
    serializer_class = ItinerarySerializer
    queryset = Itinerary.objects.all()