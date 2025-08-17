import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const router = useRouter();

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <nav className="bg-white shadow flex items-center justify-between px-8 py-4 border-b">
                    <h1 className="text-2xl font-bold text-blue-600">Minsoto Dashboard</h1>
                    <button
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                        onClick={logout}
                    >
                        Logout
                    </button>
                </nav>
                <main className="max-w-5xl mx-auto p-8 space-y-8">
                    <section className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-2">Welcome, {user?.username || 'User'}!</h2>
                        <p className="text-gray-700">Email: <span className="font-mono">{user?.email}</span></p>
                    </section>
                    <section className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
                        <div className="flex space-x-6">
                            <button
                                onClick={() => router.push('/profile/me')}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                My Profile
                            </button>
                            <button
                                onClick={() => router.push('/connections')}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                            >
                                My Connections
                            </button>
                            <button
                                onClick={() => router.push('/circles')}
                                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
                            >
                                My Circles
                            </button>
                        </div>
                    </section>
                    {/* Example: Add more widgets/components here, e.g. personalized feed, habit tracker, notifications */}
                    <section className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold mb-3">Coming Soon</h3>
                        <p className="text-gray-500">Widgets for habit tracking, collaboration, and personalized feeds will appear here!</p>
                    </section>
                </main>
            </div>
        </ProtectedRoute>
    );
};

export default Dashboard;
