from proxmoxer import ProxmoxAPI
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

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
        logger.error(f"Kết nối Proxmox thất bại: {e}")
        raise e
