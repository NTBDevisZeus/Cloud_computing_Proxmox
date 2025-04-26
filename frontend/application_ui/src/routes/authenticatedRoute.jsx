import { useContext } from "react"
import UserContext from "../context/user"
import {Navigate, useLocation} from 'react-router-dom';
const AuthenticatedRoute = ({children}) => {
    const {user} = useContext(UserContext)
    const accessToken = localStorage.getItem("accessToken")
    let {pathname} = useLocation();
    if (accessToken && !user) {
        return <div></div>
    }
    if (!user) {
        return <Navigate to={{pathname: '/login'}} state={{from: pathname}} />;
    }
    return children;
}

export default AuthenticatedRoute