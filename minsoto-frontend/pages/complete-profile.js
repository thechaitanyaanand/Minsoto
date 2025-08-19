// minsoto-frontend/pages/complete-profile.js

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import apiClient from '../lib/api';
import { useAuth } from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

const CompleteProfile = () => {
  const { user, updateUser } = useAuth();
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [themeColor, setThemeColor] = useState('#FFFFFF');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setBio(user.profile?.bio || '');
      setProfilePictureUrl(user.profile?.profile_picture_url || '');
      setThemeColor(user.profile?.theme_color || '#FFFFFF');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await apiClient.post('/auth/username/', { username });
      await apiClient.patch('/profiles/me/', {
        bio,
        profile_picture_url: profilePictureUrl,
        theme_color: themeColor,
      });
      updateUser({
        username,
        profile: { bio, profile_picture_url: profilePictureUrl, theme_color: themeColor },
      });
      router.push('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.username?.[0] ||
        err.response?.data?.bio?.[0] ||
        err.response?.data?.non_field_errors?.[0] ||
        'An error occurred. Please try again.'
      );
    }
    setSubmitting(false);
  };

  if (!user) return null;

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded shadow w-full max-w-md"
          style={{ borderTop: `5px solid ${themeColor}` }}
        >
          <h1 className="text-xl font-bold mb-4 text-center">Complete your profile</h1>
          {error && <div className="mb-4 text-red-600">{error}</div>}

          <label className="block font-medium mb-1">Username</label>
          <input
            type="text"
            required
            minLength={3}
            maxLength={30}
            placeholder="Choose a unique username"
            className="w-full border mb-4 p-2 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
          />

          <label className="block font-medium mb-1">Bio</label>
          <textarea
            placeholder="Tell us about yourself"
            className="w-full border mb-4 p-2 rounded"
            value={bio}
            maxLength={500}
            onChange={(e) => setBio(e.target.value)}
          />

          <label className="block font-medium mb-1">Profile Picture URL</label>
          <input
            type="url"
            placeholder="https://your-photo-url"
            className="w-full border mb-4 p-2 rounded"
            value={profilePictureUrl}
            onChange={(e) => setProfilePictureUrl(e.target.value)}
          />

          <label className="block font-medium mb-1">Theme Color</label>
          <input
            type="color"
            className="h-10 w-12 mr-3 align-middle"
            value={themeColor}
            onChange={(e) => setThemeColor(e.target.value)}
          />
          <span className="text-sm">{themeColor}</span>

          <button
            disabled={submitting}
            type="submit"
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded"
          >
            {submitting ? 'Submitting...' : 'Finish & Go to Dashboard'}
          </button>
        </form>
      </div>
    </ProtectedRoute>
  );
};

export default CompleteProfile;
