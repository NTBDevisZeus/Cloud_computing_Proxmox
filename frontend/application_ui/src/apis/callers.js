import axios from "axios";
import { BASE_URL, endpoints } from "./endpoints";
import { OAUTH2_CLIENT_ID, OAUTH2_CLIENT_SECRET } from "../configs";



const publicCaller = () => {
   return axios.create({
        baseURL: BASE_URL
    })
}
const authenticatedCaller = () => {
    const accessToken = localStorage.getItem("accessToken");
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    })
}

const bindSuccess = (result) => {
    return {
        message: 'success',
        data: result['data']
    }
}

const bindError = (result) => {
    return {
        message: result['message'],
        data:  null
    }
}



const callLogin = async (payload) => {
    const caller = publicCaller()
    payload = {
        ...payload,
        grant_type: "password",
        client_id: OAUTH2_CLIENT_ID,
        client_secret: OAUTH2_CLIENT_SECRET
    }
    let result = null;
    await caller.post(endpoints['auth']['login'], payload, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })
        .then(success => {
            result = bindSuccess(success)
        })
        .catch(error => {
            result = bindError(error)
        })
    return result;
}

const callRegistUser = async (payload) => {
    const caller = publicCaller()
    let result = null
    await caller.post(endpoints['auth']['register'], payload)
        .then(success => {
            result =  bindSuccess(success)
        })
        .catch(error => {
            result = bindError(error)
        })
    return result
}

const fetchUserInfo = async () => {
    const caller = authenticatedCaller();
    let result =  null;
    await caller.get(endpoints['users']['self'])
        .then(success => {
            result = bindSuccess(success)
        })
        .catch(error => {
            result = bindError(error)
        })
    return result;
}

const callGetUserVM = async (userid) => {
    const caller = authenticatedCaller()
    let result = null
    await caller.get(endpoints['users'].vms(userid))
    .then(success => {
        result = bindSuccess(success) 
    })
    .catch(error => {
        result = bindError(error)
    })
    return result;  
}

const callStartVM  = async (id) => {
    const caller = authenticatedCaller()
    let result = null
    await caller.post(endpoints['vms'].start(id))
    .then(success => {
        result = bindSuccess(success) 
    })
    .catch(error => {
        result = bindError(error)
    })
    return result;  
}

const callStopVM  = async (id) => {
    const caller = authenticatedCaller()
    let result = null
    await caller.post(endpoints['vms'].stop(id))
    .then(success => {
        result = bindSuccess(success) 
    })
    .catch(error => {
        result = bindError(error)
    })
    return result;  
}

const callgetVMIp  = async (id) => {
    const caller = authenticatedCaller()
    let result = null
    await caller.get(endpoints['vms'].ip(id))
    .then(success => {
        result = bindSuccess(success) 
    })
    .catch(error => {
        result = bindError(error)
    })
    return result;  
}

const callCreateVM = async (payload) => {
    const caller = authenticatedCaller()
    let result = null
    await caller.post(endpoints['vms']['create'], payload)
    .then(success => {
        result = bindSuccess(success) 
    })
    .catch(error => {
        result = bindError(error)
    })
    return result;  
}

export {callLogin, 
    fetchUserInfo, 
    callRegistUser, 
    callGetUserVM, 
    callStartVM, 
    callStopVM,
    callgetVMIp,
    callCreateVM
}