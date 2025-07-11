import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useAdminSetupBanner from '../hooks/useAdminSetupBanner';

const AdminSetupBanner = () => {
    const { user } = useAuth();
    const { isBannerVisible } = useAdminSetupBanner();

    // Don't show banner if not visible
    if (!isBannerVisible) {
        return null;
    }

    return (
        <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                        <div className="text-2xl">👑</div>
                        <div className="flex-1">
                            <p className="text-sm font-medium">
                                <span className="hidden sm:inline">System Setup Required: </span>
                                No admin account exists. 
                                {user ? (
                                    <span className="font-semibold"> Set up admin access now!</span>
                                ) : (
                                    <span className="font-semibold"> Login to set up admin access!</span>
                                )}
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center">
                        {user ? (
                            <Link
                                to="/admin-setup"
                                className="bg-white text-blue-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100 transition duration-200 cursor-pointer"
                            >
                                Setup Admin
                            </Link>
                        ) : (
                            <Link
                                to="/login"
                                className="bg-white text-blue-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-gray-100 transition duration-200 cursor-pointer"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSetupBanner;