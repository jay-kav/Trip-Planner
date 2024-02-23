from datetime import datetime
from function2 import linearItinerary

FOODS = ["serves_breakfast", "serves_lunch", "serves_dinner"]
NIGHT = ['night_club', 'bar']




def itinerary():
    data = {
    'tripID': 3,
    'date': '2024-01-31',
    'startTime': '18:39',
    'endTime': '18:30',
    'activities': ['zoo', 'museum', 'park', 'serves_breakfast', 'bowling_alley'],
    'country': 'Belgium',
    'city': 'Brussels',
    'toggle': False
    }



    print(data)
    trip_id = data.get('tripID')
    date = data.get('date')
    start = data.get('startTime')
    end = data.get('endTime')
    filters = data.get('activities', [])
    toggle = data.get('toggle')
    country = data.get('country')
    city = data.get('city')
    # hotel = data.get('hotel')
    hotel = [50.8503, 4.3517]


    foods = [food for food in FOODS if food in filters]
    vegetarian = ["serves_vegetarian_food" if "serves_vegetarian_food" in filters else False]
    night = [activity for activity in NIGHT if activity in filters]
    filters = [activity for activity in filters if activity not in night and activity not in foods and activity != "serves_vegetarian_food"]


    date_object = datetime.strptime(date, '%Y-%m-%d')
    day_of_week = date_object.weekday()

    start_time = datetime.strptime(start, '%H:%M')
    end_time = datetime.strptime(end, '%H:%M')

    start_minutes = start_time.hour * 60 + start_time.minute
    end_minutes = end_time.hour * 60 + end_time.minute


    # print(day_of_week)


    if toggle:
        # circularItinerary()
        pass
    else:
        activities = linearItinerary((country, city, hotel), trip_id, day_of_week, start_minutes, end_minutes, foods, filters, night, vegetarian )
        pass

    print(activities)
    return


itinerary()