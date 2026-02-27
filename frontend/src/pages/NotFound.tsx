import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="text-center max-w-md">
        <div className="text-[8rem] font-black text-gray-200 leading-none select-none">404</div>
        <h1 className="text-2xl font-bold text-gray-900 -mt-4 mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};
