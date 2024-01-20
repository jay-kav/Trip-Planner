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


def index(request):
    if request.method == 'POST':
        form = TestPullForm(request.POST)
        if form.is_valid():
            # Check the value of the hidden field to identify the button click
            if form.cleaned_data['submit_button'] == 'test_pull':
                # Call your testPull function or logic here
                testPull(request)
                # Redirect to the index page or another page
                return redirect('index')

    else:
        form = TestPullForm()

    return render(request, 'index.html', {'form': form})

def successPage (request):
    return render(request, 'success.html')

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
                print('Successfully created new user')
                return JsonResponse({'detail': 'Successfully created new user'})
            print('Failed to create new user')
            return JsonResponse({'detail': 'Failed to create new user'})
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
                return JsonResponse({'detail': 'Successfully logged in'}, status=200)
            return JsonResponse({'detail': 'Log in failed'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def logoutView(request):
    if request.method == 'POST':
        logout(request)
        return JsonResponse({'detail': 'Successfully logged out'})
    return JsonResponse({'error': 'Invalid request method'}, status=405)

class UserViewset(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

class TripViewset(viewsets.ModelViewSet):
    serializer_class = TripSerializer
    queryset = Trip.objects.all()

class ItineraryViewset(viewsets.ModelViewSet):
    serializer_class = ItinerarySerializer
    queryset = Itinerary.objects.all()
    
    
def testPull(request):
    print("testPull function is running!")
    ADMIN_URL = 'mongodb+srv://ProjectUser:cuWavbgDnQN0Abki@cluster0.rvgahvn.mongodb.net/?retryWrites=true&w=majority'
    client = MongoClient(ADMIN_URL)
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
        form_data = {
            'Date': default_date,
            'Start': default_start_time,
            'End': default_end_time,
            'Activities': data,
        }
        
        form = ItineraryForm(data=form_data)
        
        if form.is_valid():
            form.save()
            # Redirect to a success page or do something else
            return redirect('success_page')
    else:
        form = ItineraryForm()
        
    return render(request, 'success.html', {'form': form})