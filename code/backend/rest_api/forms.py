from django import forms
from django.contrib.postgres.fields import ArrayField
from .models import *
from django.forms import DateInput
from django.forms.widgets import SelectDateWidget
from django.contrib.auth.models import User

class ItineraryForm(forms.ModelForm):
    class Meta:
        model = Itinerary
        fields = ['date', 'trip_id', 'start', 'end', 'activities']

    # You can add custom validation or widgets here if needed


class TestPullForm(forms.Form):
    submit_button = forms.CharField(widget=forms.HiddenInput(), initial='test_pull')
    #
class TripForm(forms.ModelForm):
    class Meta:
        model = Trip
        fields = ['owner', 'tripname', 'location', 'startDate', 'endDate', 'members']
        
        widgets = {
            'startDate': SelectDateWidget(),
            'endDate': SelectDateWidget(),
        }