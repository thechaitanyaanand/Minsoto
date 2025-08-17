import ProtectedRoute from '../components/ProtectedRoute';
import CirclesManager from '../components/CirclesManager';

const CirclesPage = () => {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold mb-6">Circles</h1>
                    <CirclesManager />
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default CirclesPage;
