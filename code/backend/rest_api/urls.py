from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register('trips', views.TripViewset)
router.register('itineraries', views.ItineraryViewset)
router.register('users', views.UserViewset)

urlpatterns = [
    path('create-itinerary/', views.createItinerary, name='create_itinerary'),
    path('create-trip/', views.createTrip, name='create_trip'),
    path('get-activities/', views.getActivities, name='get_activities'),
    path('get-countries/', views.getCountries, name='get_countries'),
    path('get-cities/', views.getCities, name='get_cities'),
    path('add-members/', views.addMembers, name='add_members'),
    path('remove-member/', views.removeMember, name='remove_member'),
    path('delete-trip/', views.deleteTrip, name='delete_trip'),
    path('delete-itinerary/', views.deleteItinerary, name='delete_itinerary'),
    path('register/', views.registerView, name='register'),
    path('login/', views.loginView, name='login'),
    path('logout/', views.logoutView, name='logout'),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]
