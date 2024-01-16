from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.http import HttpResponse

def loginView(request):
    userPass = request.REQUEST.get('password', None)
    userMail = request.REQUEST.get('email', None)
    user = authenticate(email=userMail, password=userPass)
    if user is not None:
        print("user found")
    else:
        print("user not found")

def logoutView():
    pass

def registerView(request):
    username = request.REQUEST.get('username')
    email = request.REQUEST.get('email')
    password = request.REQUEST.get('password')
    user = User.objects.create_user(username=username, email=email, password=password)
    if user:
        user.save()
        return HttpResponse("Success")
    return HttpResponse("Failure")