from math import radians, cos, sin, asin, sqrt
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def haversine(location1, location2):
    print(location1)
    print(location2)

    # lon1 = location1[0]
    # lat1 = location1[1]
    # lon2 = location2[0]
    # lat2 = location2[1]

    lon1 , lat1 = location1
    lon2 , lat2 = location2
    """
    Calculate the great circle distance in kilometers between two points 
    on the earth (specified in decimal degrees)
    """
    # convert decimal degrees to radians 
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    r = 6371 # Radius of earth in kilometers.
    return c * r