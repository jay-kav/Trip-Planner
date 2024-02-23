from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from datetime import datetime
from .generator import linearItinerary
import random
from pymongo import MongoClient
from load_env_var import get_env_value
import json
from ..serializers import *
from ..models import *
from django.views.decorators.csrf import csrf_exempt
from ..forms import *

# Heuristic Groups
FOODS = ["serves_breakfast", "serves_lunch", "serves_dinner"]
NIGHT = ['night_club', 'bar']

# Function to Format the input to create an itinerary
@csrf_exempt
def createItinerary(request):
     # Take in input as a JSON document
     if request.method == 'POST':
        try:
            data = json.loads(request.body)
            print(data)
            # Extract all the data
            trip_id = data.get('tripID')
            date = data.get('date')
            start = data.get('startTime')
            end = data.get('endTime')
            filters = data.get('filters', [])
            toggle = data.get('roundTrip')
            country = data.get('country')
            city = data.get('city')
            hotel = data.get('hotel')

            # print(filters)
            # Only add in the filters chosen to the groups
            foods = [food for food in FOODS if food in filters] 
            vegetarian = ["serves_vegetarian_food" if "serves_vegetarian_food" in filters else False]
            night = []
            if "night_club" in filters:
                night = NIGHT
            # Seperate the ones that don't have a group
            filters = [activity for activity in filters if activity not in NIGHT and activity not in FOODS and activity != "serves_vegetarian_food"]
            # print(f"filters {filters}")
            # print(f"foods {foods}")

            # Connect to the database and get the hotels location
            collection , hotel = getHotel(hotel, country, city)

            # Convert the data to a number to represent a day of the week
            date_object = datetime.strptime(date, '%d/%m/%Y')
            day_of_week = date_object.weekday()

            # Unformat the times
            start_time = datetime.strptime(start, '%H:%M')
            end_time = datetime.strptime(end, '%H:%M')

            # Convert times to minutes
            start_minutes = start_time.hour * 60 + start_time.minute
            end_minutes = end_time.hour * 60 + end_time.minute

            # Remove 30 minutes if the user wishes to be home by the end of the time
            if toggle:
                end_minutes -= 30

            activities = []
            i = 0

            # Create different filter combinations
            filters = mixLists(filters)
            # Mix the order of the combinations
            random.shuffle(filters)

            # Ensure the filters aren't empty
            if len(filters) > 0:
                
                # Attempt all the filter combinations
                while i < (len(filters) - 1):
                    
                    # Call linearItinerary to construct the desired itinerary
                    result = linearItinerary(toggle, collection, hotel, trip_id, day_of_week, start_minutes, end_minutes, foods, list(filters[i]), night, vegetarian )
                    i += 1
            
                    # Check if an itinerary is present in the tuple
                    if result[1]:
                        print(f"Itinerary result {result[1]}")
                        activities = result[1]
                        # Ensure the last activity isn't past the end time
                        validator = activities[-1].split(';')
                        if abs(int(validator[2]) - end_minutes) < 30:
                            break
            # If the users filters fail to creat an itinerary this creates a back up one
            if not activities:
                result = backupCall(toggle, collection, hotel, trip_id, day_of_week, start_minutes, end_minutes, night, vegetarian)
                print(f"backup result {result}")
                if not result[1]:
                    # If it can't create a backup
                    return JsonResponse({'error': 'Failed to create itinerary', 'reason': 'Could not make backup'}, status=400)
                activities = result[1]

            print(f"activities {activities}")

            # Create the Itinerary Title
            title = getTitle(activities)
            print(title)

            # Format the data for the form 
            form_data = {
                'trip_id': trip_id,
                'title': title,
                'date': date,
                'start': start,
                'end': end,
                'activities': activities,
            }
        
            # Create form
            form = ItineraryForm(data=form_data)
            
            # If form is valid
            if form.is_valid():
                if form.save():
                    # Add the activities to trip 
                    add_activities(trip_id, activities)
                    return JsonResponse({'detail': 'Successfully created new itnerary'}, status=200)
                return JsonResponse({'error': 'Could not save the itinerary', 'reason': 'Could not save the itinerary'}, status=400)
            else:
                # Print the error in the form
                print(form.errors)
            return JsonResponse({'error': 'Form was not valid', 'reason': 'form was not vaid'}, status=400)
        except Exception as e:
            print(f"An error occurred: {e}")
            return  JsonResponse({'error': 'Failed to create itinerary', 'reason': 'data is not correctly formatted'}, status=400)

        

# Function to add Activities complete into Trip
@csrf_exempt
def add_activities(trip_id, activities_to_add):
    # Get the associated trip
    trip = get_object_or_404(Trip, id=trip_id)

        # Update the activities field with multiple activities
    if activities_to_add:
        # Get the activity place_ids
        result = [item.split(';')[0] for item in activities_to_add]
        # Add them to activities
        trip.activities.extend(result)
        trip.save()
        return JsonResponse({'detail': 'Successfully added activities'})
    else:
        return JsonResponse({'error': 'Invalid activities data'}, status=400)
    
# Function to create database connection and fetch hotels coordinants
@csrf_exempt
def getHotel(hotel, country, city):
    # print(f"This is the hotel placeid {hotel}, {country}, {city}")
    # Connection to mongodb
    client = MongoClient(get_env_value('MONGO_URL'))
    db = client[country]
    collection = db[city]

    # query to send
    query = {
        "place_id": hotel
    }

    document = collection.find_one(query)

    try:
        doc = document.get("geometry", {}).get("location", {})
        # Get hotels latitude and longitude
        location = [doc.get("lat"), doc.get("lng")]
        return collection, location

    except Exception as e:
            print(f"An error occurred: {e}")
            
            return  JsonResponse({'error': 'Failed to get hotel', 'reason': 'Hotel could not be found'}, status=400)

# Function to make a backup itinerary
@csrf_exempt
def backupCall(toggle, collection, hotel, trip_id, day_of_week, start_minutes, end_minutes, night, vegetarian):
    # Set all filters to selected
    backupFilters = ['zoo', 'museum', 'park', 'shopping_mall', 'bowling_alley', 'tourist_attraction', 'aquarium', "amusement_park"]
    backupFoods = ["serves_breakfast", "serves_lunch", "serves_dinner"]

    print("backup used")

    # mix up filters 
    random.shuffle(backupFilters)
    try:
        return linearItinerary(toggle, collection, hotel, trip_id, day_of_week, start_minutes, end_minutes, backupFoods, backupFilters, night, vegetarian )
    except Exception as e:
            print(f"An error occurred: {e}")
            return JsonResponse({'error': 'Failed to create itinerary', 'reason': 'Not enough activities to satisfy your request'}, status=400)

# Function to create different combinations of a list
@csrf_exempt
def mixLists(original):
    result = [original]

    for i in range(1, len(original)):
        # Brackets used to create a shallow copy , different memory location
        swapped_list = list(original) 
         # Swap the first element
        swapped_list[0], swapped_list[i] = swapped_list[i], swapped_list[0] 
        result.append(swapped_list)
    return result

# Function to create title of the itinerary
@csrf_exempt
def getTitle(actvities):
    titles = []
    # Get all the activities for that day
    for item in actvities:
        type = item.split(';')
        # Title the activities
        titles.append(type[-1].title())

    # Filter out the foods
    filtered_words = [word for word in titles if word not in ["Lunch", "Dinner", "Breakfast"]]
    
    # If more than one activity creat a formats
    if len(filtered_words) > 1:
        title = filtered_words[:-1]
        print(f"function title {title}")

        return ', '.join(title) + ' & ' + filtered_words[-1]
    return filtered_words[0]
