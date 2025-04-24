from django.urls import path, include
from rest_framework import routers


from CloudAPI.views import UserViewSet, ProxmoxViewSet

router = routers.DefaultRouter()
router.register('users', UserViewSet, basename='users')
router.register('proxmox', ProxmoxViewSet, basename='proxmox')

urlpatterns = [
    path('', include(router.urls)),

]