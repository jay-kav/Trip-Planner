from math import radians, cos, sin, asin, sqrt
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def haversine(location1, location2):
    # print(location1)
    # print(location2)

    lon1 , lat1 = location1
    lon2 , lat2 = location2

    # convert decimal degrees to radians 
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    r = 6371 # Radius of earth in kilometers.
    return c * r # Return distance in kilometers

def distanceCal(currentTime, endTime, startTime, locationTime):
    timeLeft = endTime - currentTime + locationTime

    if timeLeft < 0:
        return None
    
    overall = endTime - startTime
    halfway = overall / 2
    timeLeft = timeLeft / 60

    if timeLeft <= halfway:
        distance = timeLeft * 1.2
    else:
        distance = halfway * 2

    return distance