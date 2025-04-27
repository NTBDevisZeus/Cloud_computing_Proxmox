from datetime import datetime

from rest_framework import viewsets, generics, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from CloudAPI.utils.proxmox import connect_to_proxmox, create_vm_from_template, start_vm, stop_vm, get_vm_ip, get_os_type_name
from CloudAPI.utils import constants
from CloudAPI.models import User, VirtualMachine, Invoice, Log
from CloudAPI.serializers import UserSerializer, VirtualMachineSerializer


class UserViewSet(viewsets.ViewSet, generics.RetrieveUpdateAPIView, generics.ListCreateAPIView):
    queryset = User.objects.all();
    serializer_class = UserSerializer

    @action(methods=['get'], url_path='self', detail=False, permission_classes=[permissions.IsAuthenticated])
    def get_self_information(self, request):
        user = request.user
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

    @action(methods=['get'], url_path='vms', detail=True, permission_classes=[permissions.IsAuthenticated])
    def get_vms(self, request, pk=None):
        user = request.user
        vms = user.vms.all()
        return Response(VirtualMachineSerializer(vms, many=True).data, status=status.HTTP_200_OK)


class ProxmoxViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated,]

    @action(methods=['get'], url_path='check-proxmox', detail=False)
    def check_proxmox_connection(self, request):
        try:
            proxmox = connect_to_proxmox()
            nodes = proxmox.nodes.get()
            return Response({"status": "success", "nodes": nodes})
        except Exception as e:
            print(e)
            return Response({"status": "failed", "error": str(e)}, status=500)

    @action(methods=['get'], url_path='list-vm-templates', detail=False)
    def list_vm_templates(self, request):
        try:
            proxmox = connect_to_proxmox()
            nodes = proxmox.nodes.get()
            templates = []

            for node in nodes:
                node_name = node['node']
                qemu_vms = proxmox.nodes(node_name).qemu.get()

                for vm in qemu_vms:
                    if vm.get('template', 0) == 1:
                        vmid = vm.get('vmid')
                        config = proxmox.nodes(node_name).qemu(vmid).config.get()

                        ostype_code = config.get('ostype', 'unknown')
                        ostype_name = get_os_type_name(ostype_code)

                        template_info = {
                            'vmid': vmid,
                            'name': vm.get('name', f"template-{vmid}"),
                            'node': node_name,
                            'cpu': vm.get('cpus'),
                            'memory_mb': round(vm.get('maxmem', 0) / 1024 / 1024, 2),
                            'disk_size_gb': round(vm.get('maxdisk', 0) / 1024 / 1024 / 1024, 2),
                            'os_type': ostype_name
                        }
                        templates.append(template_info)

            return Response({"status": "success", "templates": templates})
        except Exception as e:
            print("[ERROR]", e)
            return Response({"status": "failed", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(methods=['post'], url_path='create-vm', detail=False)
    def handle_create_vm(self, request):
        user = request.user
        template_id = request.data['template_id']
        vm_name = request.data['vm_name']
        new_vm = None
        try:
            new_vm_id = create_vm_from_template(template_id, vm_name)
            if new_vm_id:
                date_release = request.data['date_release']
                date_end = request.data['date_end']
                new_vm = VirtualMachine.objects.create(name=vm_name,
                                                       vm_id=new_vm_id,
                                                       user=user,
                                                       unit_price=constants.VM_PRICE,
                                                       date_release=date_release,
                                                       date_end=date_end,
                                                       status=constants.AVAILABLE_STATUS)

                invoice =  Invoice.objects.create(
                    virtual_machine=new_vm,
                    total_amount=constants.VM_PRICE)
                user.wallet -= invoice.total_amount
                user.save()
        except Exception as e:
            print(e)
        if new_vm:
            return Response(VirtualMachineSerializer(new_vm).data, status=status.HTTP_200_OK)
        return Response({"status": "failed", "error": "Unable to create VM"}, status=status.HTTP_400_BAD_REQUEST)

    @action(methods=['post'], url_path='start-vm', detail=True)
    def handle_start_vm(self, request, pk=None):
        vm = VirtualMachine.objects.get(pk=pk)
        start_status = start_vm(vm.vm_id)
        user = request.user
        if start_status.__eq__("OK"):
            vm.status = constants.RUNNING_STATUS
            vm.save()
            Log.objects.create(user=user, virtual_machine=vm, time_start= datetime.now(), time_off=None)

        return Response({"vm_id": vm.id, "status": start_status.__eq__("OK"), 'message': start_status}, status.HTTP_200_OK)

    @action(methods=['post'], url_path='stop-vm', detail=True)
    def handle_stop_vm(self, request, pk=None):
        vm = VirtualMachine.objects.get(pk=pk)
        if vm.status == constants.AVAILABLE_STATUS:
            return Response({"vm_id": vm.id, "status": False, 'message': 'VM is not running'}, status.HTTP_400_BAD_REQUEST)
        stop_status = stop_vm(vm.vm_id)
        user = request.user
        if stop_status.__eq__("OK"):
            vm.status = constants.AVAILABLE_STATUS
            vm.save()
            log = Log.objects.filter(user=user, virtual_machine=vm, time_start__isnull=False).first()
            if log:
                log.time_off = datetime.now()
                log.save()
        return Response({"vm_id": vm.id, "status": stop_status.__eq__("OK"), 'message': stop_status}, status.HTTP_200_OK)

    @action(methods=['get'], url_path='get-ip', detail=True)
    def get_ip_address(self, request, pk=None):
        vm = VirtualMachine.objects.get(pk=pk)
        ip = get_vm_ip(vm.vm_id)
        message = 'OK'
        if not ip:
            message = "VM is not boosted"
        return Response({"ip": ip, "status": (ip is not None), 'message' : message}, status=status.HTTP_200_OK)


