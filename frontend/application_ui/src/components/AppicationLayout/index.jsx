import { Outlet } from "react-router-dom"
import Navbar from "../Navbar"
import Footer from "../Footer"

const ApplicationLayout = () => {
    return (
        <>
        <Navbar/>
        <Outlet/>
        <Footer/>
    </>
    )
}

export default ApplicationLayout