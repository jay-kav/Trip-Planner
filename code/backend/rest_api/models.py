from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class Itinerary(models.Model):
    id = models.AutoField(primary_key=True)
    Start = models.TimeField()
    End = models.TimeField()
    Activities = ArrayField(models.CharField(max_length=255)) # Array of string arrays for activities

class Trip(models.Model):
    id = models.AutoField(primary_key=True)
    Owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owner')
    Tripname = models.CharField(max_length=255) 
    Location = models.CharField(max_length=255)
    StartDate = models.DateField()
    EndDate = models.DateField() 
    Itineraries = models.ManyToManyField(Itinerary)
    Members = models.ManyToManyField(User, related_name='members')
    Created = models.DateTimeField(auto_now_add=True)
    Activities = ArrayField(models.CharField(max_length=255))  # Array of strings for Activities done s