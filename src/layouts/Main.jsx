import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import BackToTop from "@/components/BackToTop";
import AdminSetupBanner from "@/components/AdminSetupBanner";
import useAdminSetupBanner from "@/hooks/useAdminSetupBanner";
const Main = () => {
    const { isBannerVisible } = useAdminSetupBanner();
    
    return (
        <div className="min-h-screen flex flex-col">
            <AdminSetupBanner />
            <Navbar />
            <div className={`flex-grow ${isBannerVisible ? 'pt-[96px] md:pt-[104px]' : 'pt-14 md:pt-16'}`}>
                <Outlet />
            </div>
            <Footer />
            <BackToTop />
        </div>
    )
}

export default Main;
