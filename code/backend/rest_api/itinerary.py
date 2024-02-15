from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from datetime import datetime
from .generator import linearItinerary, circularItinerary
# from . import generator
import random
from itertools import permutations
import json
from .serializers import *
from .models import *
from django.views.decorators.csrf import csrf_exempt
from .forms import *


FOODS = ["serves_breakfast", "serves_lunch", "serves_dinner"]
NIGHT = ['night_club', 'bar']

@csrf_exempt
def createItinerary(request):
     if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)
            trip_id = data.get('tripID')
            date = data.get('date')
            #start = data.get('startTime')
            #end = data.get('endTime')
            start = '9:00'
            end = '17:00'
            #filters = data.get('activities', [])
            #toggle = data.get('toggle')
            filters = ['zoo', 'museum', 'park', 'serves_lunch', 'bowling_alley', 'serves_breakfast', 'serves_vegetarian_food']
            toggle = True

            # country = data.get('country')
            # city = data.get('city')
            country = 'Belgium'
            city = 'Brussels'
            # hotel = data.get('hotel')
            # hotel = [50.8503, 4.3517]
            # hotel = [50.8492581, 4.3547629]
            # hotel= [50.8488443, 4.352517199999999]
            hotel = [50.8452508, 4.3544393]


            foods = [food for food in FOODS if food in filters]
            vegetarian = ["serves_vegetarian_food" if "serves_vegetarian_food" in filters else False]
            night = [activity for activity in NIGHT if activity in filters]
            filters = [activity for activity in filters if activity not in night and activity not in foods and activity != "serves_vegetarian_food"]


            date_object = datetime.strptime(date, '%m/%d/%Y')
            day_of_week = date_object.weekday()

            start_time = datetime.strptime(start, '%H:%M')
            end_time = datetime.strptime(end, '%H:%M')

            start_minutes = start_time.hour * 60 + start_time.minute
            end_minutes = end_time.hour * 60 + end_time.minute

            i = 0
            filters = list(permutations(filters))
            random.shuffle(filters)

            while i < 11:
                if toggle:
                    result = circularItinerary((country, city, hotel), trip_id, day_of_week, (start_minutes - 30), end_minutes, foods, list(filters[i]), night, vegetarian )
                    i += 1
                    pass
                else:
                    result = linearItinerary((country, city, hotel), trip_id, day_of_week, start_minutes, end_minutes, foods, list(filters[i]), night, vegetarian )
                    i += 1
                    # pass
                print(f"Itinerary result {result[1]}")
                if result[1]:
                    activities = result[1]
                    validator = activities[-1].split(';')
                    if abs(int(validator[-1]) - end_minutes) < 30:
                        break

            form_data = {
                'trip_id': trip_id,
                'date': date,
                'start': start,
                'end': end,
                'activities': activities,
            }
        
            form = ItineraryForm(data=form_data)
            
            if form.is_valid():
                if form.save():
                    add_activities(trip_id, activities)
                    return JsonResponse({'detail': 'Successfully created new itnerary'})
                return JsonResponse({'error': 'Failed to create itinerary'}, status=400)
            else:
                print(form.errors)
            return 
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid request method'}, status=405)
        


@csrf_exempt
def add_activities(trip_id, activities_to_add):
    trip = get_object_or_404(Trip, id=trip_id)

        # Update the activities field with multiple activities
    if activities_to_add:
        result = [item.split(';')[0] for item in activities_to_add]
        trip.activities.extend(result)
        trip.save()
        return JsonResponse({'detail': 'Successfully added activities'})
    else:
        return JsonResponse({'error': 'Invalid activities data'}, status=400)