from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register('trips', views.TripViewset)
router.register('itineraries', views.ItineraryViewset)
router.register('users', views.UserViewset)

urlpatterns = [
    path('register/', views.register, name='register'),
    path('login/', views.login, name='login'),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]