from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class UserProfile(models.Model):
    userID = models.OneToOneField(User, on_delete=models.CASCADE)

class Trip(models.Model):
    id = models.AutoField(primary_key=True)
    Owner = models.ForeignKey(User, on_delete=models.CASCADE)
    Tripname = models.CharField(max_length=255) 
    Location = models.CharField(max_length=255)
    StartDate = models.DateField()
    EndDate = models.DateField() 
    Itineraries = models.ManyToManyField('Itinerary')
    Members = models.ManyToManyField(UserProfile)
    Created = models.DateTimeField(auto_now_add=True)
    Activities = ArrayField(models.CharField(max_length=255))  # Array of strings for Activities done s

class Itinerary(models.Model):
    ID = models.AutoField(primary_key=True)
    Start = models.DateField()
    End = models.DateField()
    Activities = ArrayField(models.CharField(max_length=255)) # Array of string arrays for activities
