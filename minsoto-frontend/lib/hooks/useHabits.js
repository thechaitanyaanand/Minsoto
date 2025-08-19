// lib/hooks/useHabits.js
import { useState, useEffect } from 'react';
import apiClient from '../api';

export const useHabits = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/circles/habits/');
      setHabits(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch habits');
      console.error('Error fetching habits:', err);
    } finally {
      setLoading(false);
    }
  };

  const createHabit = async (habitData) => {
    try {
      const response = await apiClient.post('/circles/habits/', habitData);
      setHabits(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error creating habit:', err);
      throw err;
    }
  };

  const markHabitComplete = async (habitId, date, notes = '') => {
    try {
      const response = await apiClient.post(`/circles/habits/${habitId}/complete/`, {
        date,
        notes
      });
      
      // Update the habit in state
      setHabits(prev => prev.map(habit => 
        habit.id === habitId 
          ? { ...habit, current_streak: response.data.habit?.current_streak || habit.current_streak }
          : habit
      ));
      
      return response.data;
    } catch (err) {
      console.error('Error marking habit complete:', err);
      throw err;
    }
  };

  const updateHabit = async (habitId, habitData) => {
    try {
      const response = await apiClient.patch(`/circles/habits/${habitId}/`, habitData);
      setHabits(prev => prev.map(habit => 
        habit.id === habitId ? response.data : habit
      ));
      return response.data;
    } catch (err) {
      console.error('Error updating habit:', err);
      throw err;
    }
  };

  const deleteHabit = async (habitId) => {
    try {
      await apiClient.delete(`/circles/habits/${habitId}/`);
      setHabits(prev => prev.filter(habit => habit.id !== habitId));
    } catch (err) {
      console.error('Error deleting habit:', err);
      throw err;
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  return {
    habits,
    loading,
    error,
    fetchHabits,
    createHabit,
    markHabitComplete,
    updateHabit,
    deleteHabit
  };
};
