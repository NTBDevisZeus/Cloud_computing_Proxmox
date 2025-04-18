
import { useEffect, useState } from 'react'
import './App.css'
import UserContext from './context/user'
import ApplicationRouter from './routes/applicationRouter'
import { fetchUserInfo } from './apis/callers';

function App() {
  const [user, setUser] = useState(null)
  ;
  const initUserInfo = async () => {
    const userInfo = await fetchUserInfo()
    if (userInfo) {
      setUser(userInfo)
    }
    else {
      localStorage.removeItem("accessToken")
    }
  }
  useEffect( () => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && !user) {
      initUserInfo
    }
  },[])
  return (
   <UserContext.Provider value={{user, setUser}}>
      <ApplicationRouter/>
   </UserContext.Provider>
  )
}

export default App
