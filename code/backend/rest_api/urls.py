from django.urls import path, include

from .views import authentication, itinerary, views, viewsets
from rest_framework import routers

router = routers.DefaultRouter()
router.register('trips', viewsets.TripViewset)
router.register('itineraries', viewsets.ItineraryViewset)
router.register('users', viewsets.UserViewset)

urlpatterns = [
    path('add-members/', views.addMembers, name='add_members'),
    path('change-owner/', views.changeOwner, name='change_owner'),
    path('clear-activities/', views.clearActivities, name='clear_activities'),
    path('create-trip/', views.createTrip, name='create_trip'),
    path('delete-trip/', views.deleteTrip, name='delete_trip'),
    path('delete-itinerary/', views.deleteItinerary, name='delete_itinerary'),
    path('get-activities/', views.getActivities, name='get_activities'),
    path('get-countries/', views.getCountries, name='get_countries'),
    path('get-cities/', views.getCities, name='get_cities'),
    path('get-hotels/', views.getHotels, name='get_hotels'),
    path('remove-member/', views.removeMember, name='remove_member'),

    # Itinerary routes
    path('create-itinerary/', itinerary.createItinerary, name='create_itinerary'),

    # Authentication routes
    path('register/', authentication.registerView, name='register'),
    path('login/', authentication.loginView, name='login'),
    path('logout/', authentication.logoutView, name='logout'),

    # Api routes
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]
