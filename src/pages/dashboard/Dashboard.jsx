import { Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { ClipLoader } from 'react-spinners';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ClipLoader color="#10b981" size={50} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">Please log in to access the dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Header */}
      <DashboardHeader />

      {/* Main Content */}
      <main className="pt-20 lg:pt-24 lg:ml-64 p-4 lg:p-8 min-h-screen overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default Dashboard;