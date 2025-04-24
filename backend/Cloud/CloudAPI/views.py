
from rest_framework import viewsets, generics, status, views, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from CloudAPI.utils.proxmox import connect_to_proxmox, create_vm_from_template  # import từ file utils
from CloudAPI.utils import constant
from CloudAPI.models import User, VirtualMachine
from CloudAPI.serializers import UserSerializer, VirtualMachineSerializer


class UserViewSet(viewsets.ViewSet, generics.RetrieveUpdateAPIView, generics.ListCreateAPIView):
    queryset = User.objects.all();
    serializer_class = UserSerializer

    @action(methods=['get'], url_path='self', detail=False)
    def get_self_information(self, request):
        user = request.user
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)


class ProxmoxViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated,]

    @action(methods=['get'], url_path='check-proxmox/', detail=False)
    def check_proxmox_connection(self, request):
        try:
            proxmox = connect_to_proxmox()
            nodes = proxmox.nodes.get()
            return Response({"status": "success", "nodes": nodes})
        except Exception as e:
            print(e)
            return Response({"status": "failed", "error": str(e)}, status=500)

    @action(methods=['post'], url_path='create-vm/', detail=False)
    def handle_create_vm(self, request):
        user = request.user
        template_id = request.data['template_id']
        vm_name = request.data['vm_name']

        proxmox = connect_to_proxmox()
        default_node = proxmox.nodes.get()[0]
        new_vm = None
        try:
            new_vm_id = create_vm_from_template(template_id, default_node, vm_name)
            release_date = request.data['release_date']
            end_date = request.data['end_date']
            new_vm = VirtualMachine.objects.create(name=vm_name,
                                          vm_id=new_vm_id,
                                          user=user,
                                          unit_price=constant.VM_PRICE,
                                          release_date=release_date,
                                          end_date=end_date,
                                          status=constant.ACTIVE_STATUS)
        except Exception as e:
            print(e)
        if new_vm:
            return Response(VirtualMachineSerializer(new_vm).data, status=status.HTTP_200_OK)
        return Response({"status": "failed", "error": "Unable to create VM"}, status=status.HTTP_400_BAD_REQUEST)



