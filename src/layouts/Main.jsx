import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
const Main = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="pt-14 md:pt-16 flex-grow">
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default Main;
