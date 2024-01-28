from django import forms
from .models import *
from django.forms.widgets import SelectDateWidget

class ItineraryForm(forms.ModelForm):
    class Meta:
        model = Itinerary
        fields = ['date', 'trip_id', 'start', 'end', 'activities']

class TripForm(forms.ModelForm):
    class Meta:
        model = Trip
        fields = ['owner', 'tripname', 'location', 'startDate', 'endDate', 'members']
        
        widgets = {
            'startDate': SelectDateWidget(),
            'endDate': SelectDateWidget(),
        }