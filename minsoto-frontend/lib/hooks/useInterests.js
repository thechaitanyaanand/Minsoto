// lib/hooks/useInterests.js
import { useState, useEffect } from 'react';
import apiClient from '../api';

export const useInterests = () => {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInterests = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/connections/interests/');
      setInterests(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch interests');
      console.error('Error fetching interests:', err);
    } finally {
      setLoading(false);
    }
  };

  const createInterest = async (interestData) => {
    try {
      const response = await apiClient.post('/connections/interests/', interestData);
      setInterests(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error creating interest:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchInterests();
  }, []);

  return {
    interests,
    loading,
    error,
    fetchInterests,
    createInterest
  };
};
