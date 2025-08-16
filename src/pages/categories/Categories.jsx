import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Categories = () => {
  const navigate = useNavigate();

  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api`;

  const {
    data: courts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['courts', 'categories'],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/courts?limit=200`);
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch courts');
      }
      return result.data.map((c) => ({ ...c, id: c._id }));
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
    onError: () => toast.error('Failed to load categories'),
  });

  const categories = useMemo(() => {
    const typeToInfo = new Map();
    courts.forEach((c) => {
      const current = typeToInfo.get(c.type) || { count: 0, image: c.image };
      typeToInfo.set(c.type, { count: current.count + 1, image: current.image || c.image });
    });
    return Array.from(typeToInfo.entries()).map(([type, info]) => ({ type, ...info }));
  }, [courts]);

  // Pagination (9 per page)
  const [page, setPage] = useState(1);
  const pageSize = 9;
  const totalPages = Math.ceil(categories.length / pageSize) || 1;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pagedCategories = categories.slice(start, end);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-700 mb-2">Unable to load categories</h3>
              <p className="text-red-600 mb-4">{error?.message || 'Please try again later.'}</p>
              <button
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" /> Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 md:py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-6 md:mb-10">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">Browse by Categories</h1>
          <p className="mt-2 text-gray-600">Discover courts by sport type and find your next game.</p>
        </div>

        {categories.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <p className="text-gray-700">No categories available right now.</p>
            </div>
          </div>
        ) : (
          <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {pagedCategories.map((cat) => (
              <div
                key={cat.type}
                className="group rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-44 md:h-52 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.type}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <h3 className="text-lg md:text-xl font-semibold capitalize">{cat.type}</h3>
                    <p className="text-xs md:text-sm opacity-90">{cat.count} courts</p>
                  </div>
                </div>
                <div className="p-4">
                  <button
                    onClick={() => navigate(`/categories/${encodeURIComponent(cat.type.toLowerCase())}`)}
                    className="w-full md:w-auto inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 transition-colors cursor-pointer"
                  >
                    View Courts
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Pagination */}
          <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-3">
            <div className="text-xs md:text-sm text-gray-700">
              Showing {start + 1} to {Math.min(end, categories.length)} of {categories.length} categories
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer text-xs md:text-sm"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 border rounded-md cursor-pointer text-xs md:text-sm ${page === i + 1 ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-300 hover:bg-gray-50'}`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 cursor-pointer text-xs md:text-sm"
              >
                Next
              </button>
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Categories;


