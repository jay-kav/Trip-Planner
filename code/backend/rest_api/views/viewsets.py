from rest_framework import viewsets
from django_filters import rest_framework as filters
from ..models import User, Trip, Itinerary
from ..serializers import UserSerializer, TripSerializer, ItinerarySerializer

   
class UserViewset(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ['is_staff', 'id']
    queryset = User.objects.all()

class TripViewset(viewsets.ModelViewSet):
    serializer_class = TripSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ['members']
    queryset = Trip.objects.all()

class ItineraryViewset(viewsets.ModelViewSet):
    serializer_class = ItinerarySerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_fields = ['trip_id']
    queryset = Itinerary.objects.all()