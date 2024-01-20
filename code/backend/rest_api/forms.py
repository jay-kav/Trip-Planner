from django import forms
from django.contrib.postgres.fields import ArrayField
from .models import Itinerary

class ItineraryForm(forms.ModelForm):
    class Meta:
        model = Itinerary
        fields = ['date', 'start', 'end', 'activities']

    # You can add custom validation or widgets here if needed


class TestPullForm(forms.Form):
    submit_button = forms.CharField(widget=forms.HiddenInput(), initial='test_pull')