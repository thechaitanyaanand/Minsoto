// pages/index.js
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import ContentFeed from '../components/ContentFeed';
import ProtectedRoute from '../components/ProtectedRoute';

const HomePage = () => {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) return null;

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <nav className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <h1 className="text-xl font-bold text-blue-600">Minsoto</h1>
                            </div>
                            <div className="flex items-center space-x-4">
                                <span>Welcome, {user?.username}!</span>
                                <button
                                    onClick={() => router.push('/profile/me')}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Profile
                                </button>
                                <button
                                    onClick={() => router.push('/connections')}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Connections
                                </button>
                                <button
                                    onClick={() => router.push('/circles')}
                                    className="text-blue-600 hover:text-blue-800"
                                >
                                    Circles
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <ContentFeed feedType="personalized" />
                </main>
            </div>
        </ProtectedRoute>
    );
};

export default HomePage;
