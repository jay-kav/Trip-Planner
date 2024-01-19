from rest_framework import viewsets
from .serializers import *
from .models import *
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, logout, login

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