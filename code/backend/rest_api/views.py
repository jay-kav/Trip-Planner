from django.shortcuts import render, redirect
from rest_framework import viewsets
from .serializers import *
from .models import *
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
                'members': members,
                'activities': []
            }
            
            form = TripForm(data=form_data)
            if form.is_valid():
                form.save()
            
            return JsonResponse({'detail': 'Successfully created new trip'})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid request method'}, status=405)
    
def createItinerary(request):
<<<<<<< Updated upstream
    client = MongoClient(ADMIN_URL)
=======
    print("testPull function is running!")
    client = MongoClient(get_env_value('ADMIN_URL'))
>>>>>>> Stashed changes
    db = client['Belgium']
    collection = db['Brussels']
    
    cursor = collection.find().limit(5)
    
    data = []
    for document in cursor:
        product_id = str(document.get("place_id"))
        opening_times = str(document.get("cleaned_times", [])[0])
        
        result = product_id + ";" + opening_times
        
        data.append(result)
    
    # Assuming 11/12/24 as the date, 8 am as start time, and 6 pm as end time
    default_date = '11/12/24'
    default_start_time = '08:00'
    default_end_time = '18:00'
    
    if request.method == 'POST':
        json_data = json.loads(request.body)
        date = json_data.get('date')
        start_time = json_data.get('startTime')
        end_time = json_data.get('endTime')
        form_data = {
            'date': date,
            'start': start_time,
            'end': end_time,
            'activities': data,
        }
        
        form = ItineraryForm(data=form_data)
        
        if form.is_valid():
            form.save()
            # Redirect to a success page or do something else
            return redirect('success_page')
    else:
        form = ItineraryForm()
        
    return render(request, 'success.html', {'form': form})

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