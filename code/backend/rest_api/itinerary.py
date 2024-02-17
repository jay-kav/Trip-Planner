from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from datetime import datetime
from .generator import linearItinerary
import random
from pymongo import MongoClient
from load_env_var import get_env_value
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
            start = data.get('startTime')
            end = data.get('endTime')
            #start = '9:00'
            #end = '18:00'
            filters = data.get('filters', [])
            toggle = data.get('roundtrip')
            #filters = ['tourist_attraction', 'museum', 'park', 'serves_lunch', 'bowling_alley', 'serves_breakfast', 'shopping_mall']
            #toggle = False

            country = data.get('country')
            city = data.get('city')
            # country = "Belgium"
            # city = "Brussels"
            hotel = data.get('hotel')
            # hotel = [50.8503, 4.3517]
            # hotel = [50.8492581, 4.3547629]
            # hotel= [50.8488443, 4.352517199999999]
            # hotel = [50.8452508, 4.3544393]

            print(filters)
            foods = [food for food in FOODS if food in filters]
            vegetarian = ["serves_vegetarian_food" if "serves_vegetarian_food" in filters else False]
            night = [activity for activity in NIGHT if activity in filters]
            filters = [activity for activity in filters if activity not in night and activity not in foods and activity != "serves_vegetarian_food"]
            print(f"filters {filters}")
            print(f"foods {foods}")
            # collection , hotel = getHotel(hotel, country, city)
            collection = tmpCollection(country, city)
            date_object = datetime.strptime(date, '%m/%d/%Y')
            day_of_week = date_object.weekday()

            start_time = datetime.strptime(start, '%H:%M')
            end_time = datetime.strptime(end, '%H:%M')

            start_minutes = start_time.hour * 60 + start_time.minute
            end_minutes = end_time.hour * 60 + end_time.minute

            if toggle:
                end_minutes -= 30

            i = 0
            filters = mixLists(filters)
            random.shuffle(filters)
            print(day_of_week)

            while i < (len(filters) - 1):
                
                result = linearItinerary(toggle, collection, hotel, trip_id, day_of_week, start_minutes, end_minutes, foods, list(filters[i]), night, vegetarian )
                i += 1
        
    
                if result[1]:
                    print(f"Itinerary result {result[1]}")
                    activities = result[1]
                    validator = activities[-1].split(';')
                    if abs(int(validator[-1]) - end_minutes) < 30:
                        break

            if not activities:
                activities = backupCall(toggle, collection, hotel, trip_id, day_of_week, start_minutes, end_minutes, night, vegetarian)

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
    
@csrf_exempt
def getHotel(hotel, country, city):
    client = MongoClient(get_env_value('MONGO_URL'))
    db = client[country]
    collection = db[city]

    query = {
        "place_id": hotel
    }

    document = collection.find_one(query)

    doc = document.get("geometry", {}).get("location", {})
    location = [doc.get("lat"), doc.get("lng")]
    return collection, location

@csrf_exempt
def tmpCollection(country, city):
    client = MongoClient(get_env_value('MONGO_URL'))
    db = client[country]
    collection = db[city]
    # print("collection retrieved")
    # print(collection)

    return collection

@csrf_exempt
def backupCall(toggle, collection, hotel, trip_id, day_of_week, start_minutes, end_minutes, night, vegetarian):
    filters = ['zoo', 'museum', 'park', 'shopping_mall', 'bowling_alley', 'tourist_attraction', 'aquarium', "amusement_park"]
    foods = ["serves_breakfast", "serves_lunch", "serves_dinner"]

    print("backup used")

    filters = random.shuffle(filters)

    return linearItinerary(toggle, collection, hotel, trip_id, day_of_week, start_minutes, end_minutes, foods, filters, night, vegetarian )

@csrf_exempt
def mixLists(origional):
    result = [origional]
    
    for i in range(1, len(origional)):
        swapped_list = list(origional)  # Brackets used to create a shallow copy , different memory location
        swapped_list[0], swapped_list[i] = swapped_list[i], swapped_list[0]  # Swap the first element
        result.append(swapped_list)
    return result