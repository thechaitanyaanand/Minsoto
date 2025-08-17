import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import apiClient from '../../lib/api';
import ProtectedRoute from '../../components/ProtectedRoute';

const ProfilePage = () => {
  const router = useRouter();
  const { username } = router.query;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;
    
    // Handle the special case of "me" 
    if (username === 'me') {
      // Fetch current logged-in user's profile using the existing API
      apiClient.get('/profiles/me/')
        .then(response => {
          setProfile(response.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching own profile:', err);
          setError('Could not load your profile.');
          setLoading(false);
        });
    } else {
      // Fetch other user's profile by username
      apiClient.get(`/profiles/${username}/`)
        .then(response => {
          setProfile(response.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching profile:', err);
          setError('Profile not found.');
          setLoading(false);
        });
    }
  }, [username]);

  if (loading) return (
    <ProtectedRoute>
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading profile...</div>
      </div>
    </ProtectedRoute>
  );

  if (error) return (
    <ProtectedRoute>
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    </ProtectedRoute>
  );

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center space-x-4 mb-6">
              {profile.profile?.profile_picture_url && (
                <img
                  src={profile.profile.profile_picture_url}
                  alt={`${profile.username}'s profile`}
                  className="w-20 h-20 rounded-full"
                />
              )}
              <div>
                <h1 className="text-2xl font-bold">{profile.username}</h1>
                <p className="text-gray-600">{profile.first_name} {profile.last_name}</p>
              </div>
            </div>
            
            {profile.profile?.bio && (
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">About</h2>
                <p className="text-gray-700">{profile.profile.bio}</p>
              </div>
            )}
            
            {username === 'me' && (
              <button
                onClick={() => router.push('/profile/edit')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
