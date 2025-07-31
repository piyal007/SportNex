import { useQuery } from '@tanstack/react-query';
import { courtsAPI } from '../utils/api';
import { ScaleLoader } from 'react-spinners';

const TestTanStack = () => {
  // Using TanStack Query for GET request
  const {
    data: courts,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['courts'], // Unique key for this query
    queryFn: async () => {
      const response = await courtsAPI.getAllCourts();
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <ScaleLoader color="#10b981" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500 mb-4">Error: {error?.message}</p>
        <button 
          onClick={() => refetch()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">TanStack Query Test - Courts</h2>
        <button 
          onClick={() => refetch()}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Refresh Data
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-gray-600 mb-4">
          Total Courts: {courts?.pagination?.total || courts?.data?.length || 0}
        </p>
        
        {courts?.data && courts.data.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courts.data.slice(0, 6).map((court, index) => (
              <div key={court._id || index} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">
                  {court.name || `Court ${index + 1}`}
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  Type: {court.type || 'N/A'}
                </p>
                <p className="text-green-600 font-medium">
                  ${court.pricePerSession || 'N/A'}/session
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No courts available</p>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-500">
        <p>✅ Data fetched using TanStack Query</p>
        <p>✅ Automatic caching and background refetching</p>
        <p>✅ Loading and error states handled</p>
      </div>
    </div>
  );
};

export default TestTanStack;