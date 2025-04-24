import time
import uuid
from proxmoxer import ProxmoxAPI
from django.conf import settings

def connect_to_proxmox():
    try:
        proxmox = ProxmoxAPI(
            settings.PROXMOX_SERVER_URL,
            user=settings.PROXMOX_SERVER_USERNAME,
            password=settings.PROXMOX_SERVER_PASSWORD,
            verify_ssl=False
        )
        return proxmox
    except Exception as e:
        raise e

def create_vm_from_template(node_id, template_id, vm_name):
    try:
        proxmox_server = connect_to_proxmox()
        vm_id = uuid.uuid4()
        config = {
            'vmid': vm_id,
            'name': vm_name,
            'clone': template_id,
        }
        task_id = proxmox_server.nodes(node_id).qemu.post(vmid=vm_id, **config)
        task_status = proxmox_server.nodes(node_id).tasks(task_id).status.get()
        while task_status['status'] == 'running':
            print(f"Cloning in progress... ({task_status['status']})")
            time.sleep(2)
            task_status = proxmox_server.nodes(node_id).tasks(task_id).status.get()
        if task_status['status'] == 'ok':
            print(f"Created new virtual machine ID: {vm_name}")
            return vm_id
        else:
            return None
    except Exception as e:
        print(e)
        return None
