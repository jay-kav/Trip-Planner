from django.contrib import admin
from . import views
from django.urls import path, include
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'user', views.UserViewSet)

urlpatterns = [
    path('api/', include(router.urls))
]