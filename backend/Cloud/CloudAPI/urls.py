from django.urls import path, include
from rest_framework import routers
from CloudAPI.views import UserViewSet
router = routers.DefaultRouter()
router.register('users',UserViewSet.UserViewSet, basename='users' )
urlpatterns = [
    path('', include(router.urls)),
]