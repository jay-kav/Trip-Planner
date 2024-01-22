from django.urls import path, include
from . import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register('trips', views.TripViewset)
router.register('itineraries', views.ItineraryViewset)
router.register('users', views.UserViewset)

urlpatterns = [
    path('', views.index, name="index"),
    path('test-pull/', views.testPull, name='test_pull'),
    path('test-success/', views.successPage, name='success_page'),
    path('register/', views.registerView, name='register'),
    path('login/', views.loginView, name='login'),
    path('logout/', views.logoutView, name='logout'),
    #path('createtrip/', views., name='createtrip'),
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]