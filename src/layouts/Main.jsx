import { Outlet } from "react-router-dom";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
import BackToTop from "@/components/BackToTop";
import AdminSetupBanner from "@/components/AdminSetupBanner";
import useAdminSetupBanner from "@/hooks/useAdminSetupBanner";
import GlobalLoader from "@/components/GlobalLoader";
const Main = () => {
    const { isBannerVisible } = useAdminSetupBanner();

    return (
        <GlobalLoader>
            <div className="min-h-screen flex flex-col">
                <AdminSetupBanner />
                <Navbar />
                <div className={`flex-grow ${isBannerVisible ? 'pt-[96px] md:pt-[104px]' : 'pt-14 md:pt-16'}`}>
                    <Outlet />
                </div>
                <Footer />
                <BackToTop />
            </div>
        </GlobalLoader>
    )
}

export default Main;
