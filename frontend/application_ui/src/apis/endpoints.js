const BASE_URL = 'http://localhost:8000'
const endpoints = {
    auth: {
        login: "/o/token/",
        register: "/users/"
    },
    users: {
        self: '/users/self/'
    }
}

export  {endpoints, BASE_URL}