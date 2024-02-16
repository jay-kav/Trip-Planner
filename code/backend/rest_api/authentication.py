from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
import json

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