// components/ConnectionRequestModal.js
import { useState } from 'react';
import { useConnections } from '../lib/hooks/useConnections';
import { useApp } from '../context/AppContext';
import apiClient from '../lib/api';

const ConnectionRequestModal = ({ onClose, interests }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [requestType, setRequestType] = useState('connection');
  const [selectedInterest, setSelectedInterest] = useState('');
  const [message, setMessage] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  
  const { sendConnectionRequest } = useConnections();
  const { setSuccessMessage, setError } = useApp();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setSearching(true);
    try {
      // This would be a user search endpoint - you'll need to implement this
      const response = await apiClient.get(`/users/search/?q=${searchQuery}`);
      setSearchResults(response.data);
    } catch (err) {
      setError('Failed to search users');
    } finally {
      setSearching(false);
    }
  };

  const handleSendRequest = async () => {
    if (!selectedUser) return;
    
    try {
      await sendConnectionRequest(
        selectedUser.id,
        requestType,
        selectedInterest || null,
        message
      );
      
      setSuccessMessage(`${requestType === 'friend' ? 'Friend' : 'Connection'} request sent!`);
      onClose();
    } catch (err) {
      setError('Failed to send request');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Find People</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {!selectedUser ? (
            <div>
              <div className="mb-4">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Search by username or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  />
                  <button
                    onClick={handleSearch}
                    disabled={searching}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {searching ? '...' : 'Search'}
                  </button>
                </div>
              </div>
              
              {searchResults.length > 0 && (
                <div className="space-y-2">
                  {searchResults.map(user => (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUser(user)}
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <img
                        src={user.profile?.profile_picture_url || '/default-avatar.png'}
                        alt={user.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{user.first_name} {user.last_name}</p>
                        <p className="text-sm text-gray-500">@{user.username}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <img
                  src={selectedUser.profile?.profile_picture_url || '/default-avatar.png'}
                  alt={selectedUser.username}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-medium">{selectedUser.first_name} {selectedUser.last_name}</p>
                  <p className="text-sm text-gray-500">@{selectedUser.username}</p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600 ml-auto"
                >
                  Change
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Request Type
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="connection"
                      checked={requestType === 'connection'}
                      onChange={(e) => setRequestType(e.target.value)}
                      className="mr-2"
                    />
                    <div>
                      <span className="font-medium">Connection</span>
                      <p className="text-sm text-gray-500">Share content for specific interests</p>
                    </div>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="friend"
                      checked={requestType === 'friend'}
                      onChange={(e) => setRequestType(e.target.value)}
                      className="mr-2"
                    />
                    <div>
                      <span className="font-medium">Friend</span>
                      <p className="text-sm text-gray-500">Full profile access and closer relationship</p>
                    </div>
                  </label>
                </div>
              </div>
              
              {requestType === 'connection' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shared Interest (Optional)
                  </label>
                  <select
                    value={selectedInterest}
                    onChange={(e) => setSelectedInterest(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select an interest...</option>
                    {interests.map(interest => (
                      <option key={interest.id} value={interest.id}>
                        {interest.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Introduce yourself or explain why you'd like to connect..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              
              <button
                onClick={handleSendRequest}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Send {requestType === 'friend' ? 'Friend' : 'Connection'} Request
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectionRequestModal;
