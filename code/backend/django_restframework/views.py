from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import *
from .serializers import *

# Create your views here.
class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    model = User
    permission_classes = [AllowAny]
    queryset = User.objects.all()