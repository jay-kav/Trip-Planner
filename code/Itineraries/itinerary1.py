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
            #filters = data.get('filters', [])
            #country = data.get('country')
            #city = data.get('city')
            #hotel = data.get('hotel')
            
            client = MongoClient(get_env_value('MONGO_URL'))
            db = client['Belgium']
            collection = db['Brussels']
            
            cursor = collection.find().limit(5)
    
            activities = []
            trip = []
            for document in cursor:
                product_id = str(document.get("place_id"))
                opening_times = str(document.get("cleaned_times", [])[0])
                
                result = product_id + ";" + opening_times
                
                trip.append(product_id)
                activities.append(result)
                
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
                    add_activities(trip_id, trip)
                    return JsonResponse({'detail': 'Successfully created new itnerary'})
                return JsonResponse({'error': 'Failed to create itinerary'}, status=400)
            else:
                print(form.errors)
            return JsonResponse({'error': 'Failed to create itinerary'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid request method'}, status=405)