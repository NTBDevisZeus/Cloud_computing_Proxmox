from rest_framework import viewsets, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response

from CloudAPI.models import User
from CloudAPI.serializers.UserSerializer import UserSerializer


class UserViewSet(viewsets.ViewSet, generics.RetrieveUpdateAPIView, generics.ListCreateAPIView):
    queryset = User.objects.all();
    serializer_class = UserSerializer

    @action(methods=['get'], url_path='self', detail=False)
    def get_self_information(self, request):
        user = request.user
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)