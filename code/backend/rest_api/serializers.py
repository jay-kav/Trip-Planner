from rest_framework import serializers
from .models import *

class UserSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = User
		fields = ['id', 'url', 'username', 'email', 'password']

class TripSerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Trip
		fields = ['id', 'Owner', 'Tripname', 'Location', 'StartDate', 'EndDate', 'Itineraries', 'Members', 'Created', 'Activities']

class ItinerarySerializer(serializers.HyperlinkedModelSerializer):
	class Meta:
		model = Itinerary
		fields = ['id', 'Start', 'End', 'Activities']