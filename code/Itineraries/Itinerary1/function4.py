from math import radians, cos, sin, asin, sqrt

def haversine(location1, location2):
    lon1 = location1[0]
    lat1 = location1[1]
    lon2 = location2[0]
    lat2 = location2[1]


    # convert decimal degrees to radians 
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    r = 6371 # Radius of earth in kilometers. Use 3956 for miles. Determines return value units.
    return c * r


print(haversine([50.85569599999999, 4.353714699999998] , [50.85201120000001, 4.353880200000001]))