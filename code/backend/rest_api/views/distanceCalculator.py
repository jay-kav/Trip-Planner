from math import radians, cos, sin, asin, sqrt
from django.views.decorators.csrf import csrf_exempt

# Function to calcualte the distance between two locations
@csrf_exempt
def haversine(location1, location2):
    try:
        lon1 , lat1 = location1
        lon2 , lat2 = location2

        # convert decimal degrees to radians 
        lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

        # haversine formula 
        dlon = lon2 - lon1 
        dlat = lat2 - lat1 
        a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
        c = 2 * asin(sqrt(a)) 

        # Radius of earth in kilometers
        r = 6371 
        # Return distance in kilometers
        return c * r
    except Exception as e:
        print(f"An error occurred: {e}")
        return  5 # pass an out of bound number to ensure the system keeps running 

# Function to dynamically calculate the max distance allowed between two locations
def distanceCal(currentTime, endTime, startTime, locationTime):
    timeLeft = endTime - currentTime + locationTime

    if timeLeft < 0:
        return None
    # How many hours in the itinerary
    overall = endTime - startTime
    halfway = overall / 2
    timeLeft = timeLeft / 60

    # if past the half way point reduce the distance
    if timeLeft <= halfway:
        distance = timeLeft * 1.2
    # otherwise increase the distance
    else:
        distance = halfway * 2

    return distance