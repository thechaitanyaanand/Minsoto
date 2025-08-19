// components/ConnectionsManager.js
import { useState, useEffect } from 'react';
import { useConnections } from '../lib/hooks/useConnections';
import { useInterests } from '../lib/hooks/useInterests';
import { useApp } from '../context/AppContext';
import ConnectionRequestModal from './ConnectionRequestModal';
import ConnectionCard from './ConnectionCard';

const ConnectionsManager = () => {
  const { connections, requests, loading, respondToRequest } = useConnections();
  const { interests } = useInterests();
  const { setSuccessMessage, setError } = useApp();
  const [activeTab, setActiveTab] = useState('connections');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [filterType, setFilterType] = useState('all');

  const filteredConnections = connections.filter(conn => 
    filterType === 'all' || conn.connection_type === filterType
  );

  const handleAcceptRequest = async (requestId) => {
    try {
      await respondToRequest(requestId, 'accept');
      setSuccessMessage('Connection request accepted!');
    } catch (err) {
      setError('Failed to accept request');
    }
  };

  const handleDeclineRequest = async (requestId) => {
    try {
      await respondToRequest(requestId, 'decline');
      setSuccessMessage('Connection request declined');
    } catch (err) {
      setError('Failed to decline request');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Network</h1>
        <button
          onClick={() => setShowRequestModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Find People
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('connections')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'connections'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          My Connections ({connections.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'requests'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Pending Requests ({requests.length})
        </button>
      </div>

      {activeTab === 'connections' && (
        <div>
          {/* Connection Type Filter */}
          <div className="flex space-x-2 mb-4">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1 rounded-full text-sm ${
                filterType === 'all'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              All ({connections.length})
            </button>
            <button
              onClick={() => setFilterType('friend')}
              className={`px-3 py-1 rounded-full text-sm ${
                filterType === 'friend'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Friends ({connections.filter(c => c.connection_type === 'friend').length})
            </button>
            <button
              onClick={() => setFilterType('connection')}
              className={`px-3 py-1 rounded-full text-sm ${
                filterType === 'connection'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              Connections ({connections.filter(c => c.connection_type === 'connection').length})
            </button>
          </div>

          {/* Connections Grid */}
          {filteredConnections.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredConnections.map(connection => (
                <ConnectionCard
                  key={connection.id}
                  connection={connection}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No {filterType === 'all' ? '' : filterType} connections yet
              </h3>
              <p className="text-gray-500 mb-4">
                Start building your network by connecting with people who share your interests
              </p>
              <button
                onClick={() => setShowRequestModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Find People
              </button>
            </div>
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <div>
          {requests.length > 0 ? (
            <div className="space-y-4">
              {requests.map(request => (
                <div
                  key={request.id}
                  className="bg-white p-6 rounded-lg shadow border"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <img
                          src={request.sender.profile?.profile_picture_url || '/default-avatar.png'}
                          alt={request.sender.username}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {request.sender.first_name} {request.sender.last_name} (@{request.sender.username})
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              request.request_type === 'friend'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {request.request_type === 'friend' ? 'Friend Request' : 'Connection Request'}
                            </span>
                            {request.interest && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                {request.interest.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      {request.message && (
                        <p className="text-gray-600 text-sm mb-3">"{request.message}"</p>
                      )}
                      <p className="text-gray-400 text-xs">
                        {new Date(request.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDeclineRequest(request.id)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 text-sm"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📩</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
              <p className="text-gray-500">You're all caught up!</p>
            </div>
          )}
        </div>
      )}

      {showRequestModal && (
        <ConnectionRequestModal
          onClose={() => setShowRequestModal(false)}
          interests={interests}
        />
      )}
    </div>
  );
};

export default ConnectionsManager;
