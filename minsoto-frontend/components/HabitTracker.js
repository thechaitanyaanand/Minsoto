import { useState, useEffect } from 'react';
import apiClient from '../lib/api';

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: '',
    description: '',
    target_frequency: 1
  });

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await apiClient.get('/circles/habits/');
      setHabits(response.data);
    } catch (error) {
      console.error('Error fetching habits:', error);
    }
  };

  const createHabit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/circles/habits/', newHabit);
      setNewHabit({ name: '', description: '', target_frequency: 1 });
      setShowCreateForm(false);
      fetchHabits();
    } catch (error) {
      console.error('Error creating habit:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Habits</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          {showCreateForm ? 'Cancel' : 'Add Habit'}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={createHabit} className="mb-6 p-4 border rounded">
          <div className="space-y-4">
            <input
              type="text"
              value={newHabit.name}
              onChange={(e) => setNewHabit({...newHabit, name: e.target.value})}
              placeholder="Habit name"
              className="w-full p-2 border rounded"
              required
            />
            <textarea
              value={newHabit.description}
              onChange={(e) => setNewHabit({...newHabit, description: e.target.value})}
              placeholder="Description (optional)"
              className="w-full p-2 border rounded"
              rows="2"
            />
            <div>
              <label className="block text-sm font-medium mb-1">
                Target Frequency (times per day):
              </label>
              <input
                type="number"
                min="1"
                value={newHabit.target_frequency}
                onChange={(e) => setNewHabit({...newHabit, target_frequency: parseInt(e.target.value)})}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Create Habit
            </button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {habits.map(habit => (
          <div key={habit.id} className="border rounded p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold">{habit.name}</h3>
              <span className="text-sm text-gray-500">
                {habit.target_frequency}x/day
              </span>
            </div>
            {habit.description && (
              <p className="text-gray-600 text-sm mb-2">{habit.description}</p>
            )}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔥</span>
                <span className="font-medium">{habit.current_streak} days</span>
              </div>
              <div className="text-sm text-gray-500">
                Best: {habit.best_streak} days
              </div>
            </div>
          </div>
        ))}
      </div>

      {habits.length === 0 && !showCreateForm && (
        <div className="text-center text-gray-500 py-8">
          <p>No habits yet. Create your first habit to start tracking!</p>
        </div>
      )}
    </div>
  );
};

export default HabitTracker;
