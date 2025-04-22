from django.urls import path, include
from rest_framework import routers


from CloudAPI.views import UserViewSet, check_proxmox_connection

router = routers.DefaultRouter()
router.register('users', UserViewSet, basename='users')

urlpatterns = [
    path('', include(router.urls)),
    path('check-proxmox/', check_proxmox_connection),
]