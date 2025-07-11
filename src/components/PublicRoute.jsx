import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from './ui/LoadingSpinner';

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    // If user is authenticated, redirect to role-based dashboard
    if (user) {
        return <Navigate to="/redirect-dashboard" replace />;
    }

    // If user is not authenticated, allow access to public routes
    return children;
};

export default PublicRoute;