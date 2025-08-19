import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import ProtectedRoute from '../components/ProtectedRoute';
import EnhancedContentFeed from '../components/EnhancedContentFeed';
import HabitTracker from '../components/HabitTracker';

const DashboardPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Minsoto</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push('/profile/me')}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Profile
                </button>
                <button
                  onClick={() => router.push('/connections')}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Connections
                </button>
                <button
                  onClick={() => router.push('/circles')}
                  className="text-gray-700 hover:text-gray-900"
                >
                  Circles
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.username}!
            </h2>
            <p className="text-gray-600">Here's what's happening in your network</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Feed */}
            <div className="lg:col-span-2">
              <EnhancedContentFeed feedType="connections" />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <HabitTracker />
              
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push('/circles/create')}
                    className="w-full text-left p-2 rounded hover:bg-gray-100"
                  >
                    Create Circle
                  </button>
                  <button
                    onClick={() => router.push('/connections')}
                    className="w-full text-left p-2 rounded hover:bg-gray-100"
                  >
                    Find Connections
                  </button>
                  <button
                    onClick={() => router.push('/profile/me')}
                    className="w-full text-left p-2 rounded hover:bg-gray-100"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
