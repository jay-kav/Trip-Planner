from rest_framework import serializers
from .models import *

class UserSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = User
		fields = ['id', 'url', 'username', 'email', 'is_staff']

class TripSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Trip
		fields = ['id', 'owner', 'tripname', 'country', 'city', 'hotel', 'startDate', 'endDate', 'members', 'created', 'activities']

class ItinerarySerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Itinerary
		fields = ['id', 'title', 'trip_id', 'date', 'start', 'end', 'activities']