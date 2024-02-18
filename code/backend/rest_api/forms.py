from django import forms
from .models import *
from django.conf import settings
from django.forms import DateField

class ItineraryForm(forms.ModelForm):
    date = DateField(input_formats=settings.DATE_INPUT_FORMATS)
    class Meta:
        model = Itinerary
        fields = ['date', 'trip_id', 'start', 'end', 'activities']

class TripForm(forms.ModelForm):
    startDate = DateField(input_formats=settings.DATE_INPUT_FORMATS)
    endDate = DateField(input_formats=settings.DATE_INPUT_FORMATS)
    class Meta:
        model = Trip
        fields = ['owner', 'tripname', 'country', 'city', 'hotel', 'startDate', 'endDate', 'members']