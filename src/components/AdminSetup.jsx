import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../utils/api';

const AdminSetup = () => {
    const [needsSetup, setNeedsSetup] = useState(false);
    const [loading, setLoading] = useState(true);
    const [setupLoading, setSetupLoading] = useState(false);
    const { user, userDoc } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        checkAdminSetup();
    }, []);

    const checkAdminSetup = async () => {
        try {
            const response = await api.get('/api/setup/check');
            setNeedsSetup(response.data.needsSetup);
            
            if (!response.data.needsSetup) {
                toast.error('Admin setup is not available. An admin already exists.');
                navigate('/');
            }
        } catch (error) {
            console.error('Error checking admin setup:', error);
            toast.error('Failed to check admin setup status');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleAdminSetup = async () => {
        if (!user) {
            toast.error('You must be logged in to set up admin account');
            return;
        }

        setSetupLoading(true);
        
        try {
            const setupData = {
                firebaseUid: user.uid,
                name: user.displayName || userDoc?.name || 'Admin User',
                email: user.email,
                image: user.photoURL || userDoc?.image || null,
                phone: userDoc?.phone || null,
                address: userDoc?.address || null
            };

            const response = await api.post('/api/setup/admin', setupData);
            
            toast.success('Admin account created successfully!');
            console.log('Admin setup completed:', response.data);
            
            // Redirect to admin dashboard
            navigate('/admin-dashboard');
            
            // Reload the page to update auth context
            window.location.reload();
        } catch (error) {
            console.error('Error setting up admin:', error);
            
            if (error.response?.status === 403) {
                toast.error('Admin setup is no longer available');
                navigate('/');
            } else {
                toast.error(error.response?.data?.error || 'Failed to set up admin account');
            }
        } finally {
            setSetupLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Checking admin setup status...</p>
                </div>
            </div>
        );
    }

    if (!needsSetup) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Setup Not Available</h1>
                    <p className="text-gray-600">Admin setup is not available. An admin already exists in the system.</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="text-yellow-500 text-6xl mb-4">🔐</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
                    <p className="text-gray-600 mb-6">
                        You must be logged in to set up the admin account.
                    </p>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 cursor-pointer"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-8">
                    <div className="text-blue-500 text-6xl mb-4">👑</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Admin Setup Required
                    </h1>
                    <p className="text-gray-600">
                        No admin account exists in the system. Set up the first admin account to get started.
                    </p>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-blue-900 mb-2">Account Details:</h3>
                    <div className="space-y-2 text-sm text-blue-800">
                        <p><span className="font-medium">Name:</span> {user.displayName || userDoc?.name || 'Admin User'}</p>
                        <p><span className="font-medium">Email:</span> {user.email}</p>
                        {user.photoURL && (
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Photo:</span>
                                <img 
                                    src={user.photoURL} 
                                    alt="Profile" 
                                    className="w-8 h-8 rounded-full"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-2">
                        <div className="text-yellow-500 text-lg">⚠️</div>
                        <div className="text-sm text-yellow-800">
                            <p className="font-medium mb-1">Important:</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li>This action can only be performed once</li>
                                <li>You will become the system administrator</li>
                                <li>This setup will be disabled after completion</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleAdminSetup}
                    disabled={setupLoading}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition duration-200 cursor-pointer font-medium"
                >
                    {setupLoading ? (
                        <div className="flex items-center justify-center gap-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Setting up admin...
                        </div>
                    ) : (
                        'Create Admin Account'
                    )}
                </button>

                <div className="mt-4 text-center">
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-500 hover:text-gray-700 text-sm cursor-pointer"
                    >
                        Cancel and go to home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSetup;