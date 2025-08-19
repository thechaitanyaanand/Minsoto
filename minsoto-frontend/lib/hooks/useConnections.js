// lib/hooks/useConnections.js
import { useState, useEffect } from 'react';
import apiClient from '../api';

export const useConnections = () => {
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const [connectionsRes, requestsRes] = await Promise.all([
        apiClient.get('/connections/my-connections/'),
        apiClient.get('/connections/requests/')
      ]);
      
      setConnections(connectionsRes.data);
      setRequests(requestsRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch connections');
      console.error('Error fetching connections:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendConnectionRequest = async (receiverId, requestType, interestId, message = '') => {
    try {
      const response = await apiClient.post('/connections/requests/send/', {
        receiver_id: receiverId,
        request_type: requestType,
        interest_id: interestId,
        message
      });
      
      // Refresh data after sending request
      await fetchConnections();
      return response.data;
    } catch (err) {
      console.error('Error sending connection request:', err);
      throw err;
    }
  };

  const respondToRequest = async (requestId, action) => {
    try {
      await apiClient.post(`/connections/requests/${requestId}/respond/`, {
        action
      });
      
      // Refresh data after responding
      await fetchConnections();
    } catch (err) {
      console.error('Error responding to request:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  return {
    connections,
    requests,
    loading,
    error,
    fetchConnections,
    sendConnectionRequest,
    respondToRequest
  };
};
    