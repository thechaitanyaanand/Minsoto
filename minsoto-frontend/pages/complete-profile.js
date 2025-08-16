// pages/complete-profile.js
import { useState } from 'react';
import { useRouter } from 'next/router';
import apiClient from '../lib/api';

const CompleteProfile = () => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
         router.push('/login'); // Should not happen, but a good check
         return;
      }

      await apiClient.post(
        '/auth/username/',
        { username },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      
      router.push('/dashboard'); // Success!
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred.');
    }
  };

  return (
    <div>
      <h1>Welcome to Minsoto!</h1>
      <p>Please choose a unique username to complete your registration.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
        />
        <button type="submit">Save Username</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default CompleteProfile;