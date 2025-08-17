// components/CirclesManager.js
import { useState, useEffect } from 'react';
import apiClient from '../lib/api';
import { useAuth } from '../context/AuthContext';

const CirclesManager = () => {
    const [circles, setCircles] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newCircle, setNewCircle] = useState({
        name: '',
        description: '',
        circle_type: 'project',
        interests: [],
        is_private: false,
        max_members: 10
    });
    const { user } = useAuth();

    useEffect(() => {
        fetchCircles();
    }, []);

    const fetchCircles = async () => {
        try {
            const response = await apiClient.get('/circles/my-circles/');
            setCircles(response.data);
        } catch (error) {
            console.error('Error fetching circles:', error);
        }
    };

    const createCircle = async (e) => {
        e.preventDefault();
        try {
            await apiClient.post('/circles/create/', newCircle);
            setShowCreateForm(false);
            setNewCircle({
                name: '',
                description: '',
                circle_type: 'project',
                interests: [],
                is_private: false,
                max_members: 10
            });
            fetchCircles();
        } catch (error) {
            console.error('Error creating circle:', error);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Circles</h2>
                <button
                    onClick={() => setShowCreateForm(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                >
                    Create Circle
                </button>
            </div>

            {/* Create Circle Form */}
            {showCreateForm && (
                <div className="bg-white border rounded-lg p-6">
                    <h3 className="text-lg font-medium mb-4">Create New Circle</h3>
                    <form onSubmit={createCircle} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input
                                type="text"
                                value={newCircle.name}
                                onChange={(e) => setNewCircle({...newCircle, name: e.target.value})}
                                className="w-full border rounded-lg px-3 py-2"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                value={newCircle.description}
                                onChange={(e) => setNewCircle({...newCircle, description: e.target.value})}
                                className="w-full border rounded-lg px-3 py-2"
                                rows="3"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select
                                value={newCircle.circle_type}
                                onChange={(e) => setNewCircle({...newCircle, circle_type: e.target.value})}
                                className="w-full border rounded-lg px-3 py-2"
                            >
                                <option value="project">Project Collaboration</option>
                                <option value="habit">Habit Building</option>
                                <option value="accountability">Accountability Group</option>
                                <option value="learning">Learning Group</option>
                            </select>
                        </div>
                        
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            >
                                Create Circle
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowCreateForm(false)}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Circles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {circles.map(circle => (
                    <div key={circle.id} className="bg-white border rounded-lg p-6">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="font-medium text-lg">{circle.name}</h3>
                            <span className={`px-2 py-1 rounded text-xs ${
                                circle.circle_type === 'project' ? 'bg-blue-100 text-blue-800' :
                                circle.circle_type === 'habit' ? 'bg-green-100 text-green-800' :
                                circle.circle_type === 'accountability' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-purple-100 text-purple-800'
                            }`}>
                                {circle.circle_type}
                            </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4">{circle.description}</p>
                        
                        <div className="flex justify-between items-center text-sm text-gray-500">
                            <span>{circle.members_count || 0} members</span>
                            <span>Created {new Date(circle.created_at).toLocaleDateString()}</span>
                        </div>
                        
                        <button className="w-full mt-4 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                            View Circle
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CirclesManager;
