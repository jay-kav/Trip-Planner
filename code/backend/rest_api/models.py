from django.db import models
from django.contrib.auth.models import User
from django.contrib.postgres.fields import ArrayField

# Create your models here.
class Trip(models.Model):
    id = models.AutoField(primary_key=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owner')
    tripname = models.CharField(max_length=255) 
    location = models.CharField(max_length=255)
    startDate = models.DateField()
    endDate = models.DateField() 
    members = models.ManyToManyField(User, related_name='members')
    created = models.DateTimeField(auto_now_add=True)
    activities = ArrayField(models.CharField(max_length=255), default=list)  # Array of strings for Activities done s

    def __str__(self):
        return f"({self.id}) {self.tripname} - {self.owner.username}"

class Itinerary(models.Model):
    id = models.AutoField(primary_key=True)#
    trip_id = models.ForeignKey(Trip, on_delete=models.CASCADE)
    date = models.DateField()
    start = models.TimeField()
    end = models.TimeField()
    activities = ArrayField(models.CharField(max_length=255)) # Array of string arrays for activities

    def __str__(self):
        return f"({self.id}) {self.date}"