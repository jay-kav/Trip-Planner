def itinerary():
    data = {
    'tripID': 3,
    'date': '2024-01-31',
    'startTime': '9:00',
    'endTime': '17:00',
    'activities': ['zoo', 'museum', 'park', 'serves_lunch', 'bowling_alley', 'serves_breakfast', 'serves_vegetarian_food'],
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
    # hotel = [50.8503, 4.3517]
    # hotel = [50.8492581, 4.3547629]
    # hotel= [50.8488443, 4.352517199999999]
    hotel = [50.8452508, 4.3544393]


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

    i = 0
    filters = list(permutations(filters))
    random.shuffle(filters)

    while i < 11:
        if toggle:
            # circularItinerary()
            i += 1
            pass
        else:
            result = linearItinerary((country, city, hotel), trip_id, day_of_week, start_minutes, end_minutes, foods, list(filters[i]), night, vegetarian )
            i += 1
            # pass
        
        if result[1]:
            activities = result[1]
            validator = activities[-1].split(';')
            if abs(int(validator[-1]) - end_minutes) < 30:
                break

    print(activities)
    return
