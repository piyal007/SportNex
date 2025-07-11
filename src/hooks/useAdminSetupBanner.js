import { useState, useEffect } from 'react';
import api from '../utils/api';

const useAdminSetupBanner = () => {
    const [needsSetup, setNeedsSetup] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        checkAdminSetup();
    }, []);

    const checkAdminSetup = async () => {
        try {
            const response = await api.get('/api/setup/check');
            setNeedsSetup(response.data.needsSetup);
        } catch (error) {
            console.error('Error checking admin setup:', error);
        } finally {
            setLoading(false);
        }
    };

    // Banner is visible if setup is needed
    const isBannerVisible = !loading && needsSetup;

    return {
        needsSetup,
        loading,
        isBannerVisible,
        checkAdminSetup
    };
};

export default useAdminSetupBanner;