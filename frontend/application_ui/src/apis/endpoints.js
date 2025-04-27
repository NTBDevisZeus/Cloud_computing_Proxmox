const BASE_URL = 'http://localhost:8000'
const endpoints = {
    auth: {
        login: "/o/token/",
        register: "/users/"
    },
    users: {
        self: '/users/self/',
        vms: (id) => `/users/${id}/vms/`
    },
    vms: {
        create: '/vms/create-vm/',
        start: (id) => `/vms/${id}/start-vm/`,
        stop: (id) => `/vms/${id}/stop-vm/`,
        ip: (id) => `/vms/${id}/get-ip/`
    }
}

export  {endpoints, BASE_URL}