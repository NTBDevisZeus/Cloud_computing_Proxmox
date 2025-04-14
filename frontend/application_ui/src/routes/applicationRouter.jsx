import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import AuthenticatedRoute from './authenticatedRoute'
import ApplicationLayout from '../components/AppicationLayout'

const ApplicationRouter = ()  => {
    return (<BrowserRouter>
    <Routes>
       <Route element={<ApplicationLayout/>}>
            <Route index={true} path ="/"element={<Home/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path='/test' element={<AuthenticatedRoute>
                                                <Home/>
                                            </AuthenticatedRoute>}/>
        </Route>
    </Routes>
    </BrowserRouter>)
}

export default ApplicationRouter