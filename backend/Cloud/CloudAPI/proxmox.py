from proxmoxer import ProxmoxAPI

class ProxmoxServer:
    def __init__(self, server_url, username, password):
        server = ProxmoxAPI(server_url, username, password)
        self.server = server

    def get_nodes(self):
        return  self.server.nodes.list()