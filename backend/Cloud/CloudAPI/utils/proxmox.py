import random
from time import sleep

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

def check_task_status(node_id, task_id):
    try:
        proxmox_server = connect_to_proxmox()
        task_status = proxmox_server.nodes(node_id).tasks(task_id).status.get()
        step = 1
        while task_status['status'] == 'running':
            if step > 5:
                break
            print(f"Task {task_id} is running...")
            sleep(2)
            task_status = proxmox_server.nodes(node_id).tasks(task_id).status.get()
            step += 1
        print(task_status)
        return task_status['exitstatus']
    except Exception as e:
        print(e)

def is_vm_running(node, vmid):

    proxmox_server = connect_to_proxmox()
    try:
        vm_status = proxmox_server.nodes(node).qemu(vmid).status.current.get()
        return vm_status['status'] == 'running'
    except Exception as e:
        print(e)
        return False

def get_default_node(server):
    return server.nodes.get()[0]['node']

def create_vm_from_template(template_id, vm_name):
    try:
        proxmox_server = connect_to_proxmox()
        vm_id = random.randint(101, 999)
        config = {
            'newid': vm_id,
            'name': vm_name,
        }
        node_id = get_default_node(proxmox_server)
        task_id = proxmox_server.nodes(node_id).qemu(template_id).clone().post(**config)
        task_status = check_task_status(node_id, task_id)
        print(task_status)
        if task_status == 'OK':
            print(f"Created new virtual machine ID: {vm_name}")
            return vm_id
        else:
            return None
    except Exception as e:
        print(e)
        return None

def start_vm(vm_id):
    try:
        proxmox_server = connect_to_proxmox()
        node_id = get_default_node(proxmox_server)
        if is_vm_running(node_id, vm_id):
            return 'running'
        try:
            proxmox_server.nodes(node_id).qemu(vm_id).get()
        except Exception as e:
            print(e)
        task_id = proxmox_server.nodes(node_id).qemu(vm_id).status.start.post()
        task_status = check_task_status(node_id, task_id)
        return task_status
    except Exception as e:
        print(e)


def stop_vm(vm_id):
    try:
        proxmox_server = connect_to_proxmox()
        node_id = get_default_node(proxmox_server)
        try:
            proxmox_server.nodes(node_id).qemu(vm_id).get()
        except Exception as e:
            print(e)
        if not is_vm_running(node_id, vm_id):
            return 'stopped'
        task_id = proxmox_server.nodes(node_id).qemu(vm_id).status.stop.post()
        task_status = check_task_status(node_id, task_id)
        return task_status
    except Exception as e:
        print(e)

def get_vm_ip(vm_id):
    try:
        proxmox_server = connect_to_proxmox()
        node_id = get_default_node(proxmox_server)
        try:
            proxmox_server.nodes(node_id).qemu(vm_id).get()
        except Exception as e:
            print(e)
        if not is_vm_running(node_id, vm_id):
            return None
        is_boosted  = False
        step = 1
        while not is_boosted:
            if step > 5:
                break;
            try:
                ip_info = proxmox_server.nodes(node_id).qemu(vm_id).agent('network-get-interfaces').get()
                is_boosted = True
                if ip_info['result'] is not None:
                    interfaces = ip_info['result']
                    if interfaces and len(interfaces) > 0:
                        public_interface = [interface for interface in interfaces if interface['name'] == 'ens18'][0]

                        return public_interface
            except Exception as e:
                print(e)
            finally:
                sleep(5)
                step += 1
        return None
    except Exception as e:
        print(e)