// components/ConnectionsManager.js
import { useState, useEffect } from 'react';
import apiClient from '../lib/api';
import { useAuth } from '../context/AuthContext';

const ConnectionsManager = () => {
    const [connections, setConnections] = useState([]);
    const [requests, setRequests] = useState([]);
    const [interests, setInterests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [connectionsRes, requestsRes, interestsRes] = await Promise.all([
                apiClient.get('/connections/my-connections/'),
                apiClient.get('/connections/requests/'),
                apiClient.get('/connections/interests/')
            ]);
            
            setConnections(connectionsRes.data);
            setRequests(requestsRes.data);
            setInterests(interestsRes.data);
        } catch (error) {
            console.error('Error fetching connections data:', error);
        } finally {
            setLoading(false);
        }
    };

    const sendConnectionRequest = async (receiverId, requestType, interestId, message) => {
        try {
            await apiClient.post('/connections/requests/send/', {
                receiver_id: receiverId,
                request_type: requestType,
                interest_id: interestId,
                message: message
            });
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Error sending connection request:', error);
        }
    };

    const respondToRequest = async (requestId, action) => {
        try {
            await apiClient.post(`/connections/requests/${requestId}/respond/`, {
                action: action
            });
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Error responding to request:', error);
        }
    };

    if (loading) return <div>Loading connections...</div>;

    return (
        <div className="space-y-6">
            {/* Pending Requests */}
            <div>
                <h3 className="text-lg font-medium mb-4">Pending Requests</h3>
                {requests.filter(req => req.status === 'pending').map(request => (
                    <div key={request.id} className="border p-4 rounded-lg mb-2">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">{request.sender.username}</p>
                                <p className="text-sm text-gray-600">{request.message}</p>
                                {request.interest && (
                                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                        {request.interest.name}
                                    </span>
                                )}
                            </div>
                            <div className="space-x-2">
                                <button
                                    onClick={() => respondToRequest(request.id, 'accept')}
                                    className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => respondToRequest(request.id, 'decline')}
                                    className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                                >
                                    Decline
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Current Connections */}
            <div>
                <h3 className="text-lg font-medium mb-4">My Connections</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {connections.map(connection => (
                        <div key={connection.id} className="border p-4 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <img
                                    src={connection.user.profile?.profile_picture_url || '/default-avatar.png'}
                                    alt={connection.user.username}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div>
                                    <h4 className="font-medium">{connection.user.username}</h4>
                                    <p className="text-sm text-gray-600 capitalize">{connection.connection_type}</p>
                                </div>
                            </div>
                            <div className="mt-3">
                                {connection.interests.map(interest => (
                                    <span
                                        key={interest.id}
                                        className="inline-block bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs mr-1 mb-1"
                                    >
                                        {interest.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ConnectionsManager;
