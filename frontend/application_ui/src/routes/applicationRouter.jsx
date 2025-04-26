import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import AuthenticatedRoute from './authenticatedRoute'
import ApplicationLayout from '../components/AppicationLayout'
import VMList from '../pages/VMList'

const ApplicationRouter = ()  => {
    return (<BrowserRouter>
    <Routes>
       <Route element={<ApplicationLayout/>}>
            <Route index={true} path ="/"element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path='/vms' element={<AuthenticatedRoute>
                                                <VMList/>
                                            </AuthenticatedRoute>}/>
        </Route>
    </Routes>
    </BrowserRouter>)
}

export default ApplicationRouter