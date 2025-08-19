import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import apiClient from '../../lib/api';
import ProtectedRoute from '../../components/ProtectedRoute';
import ProfileWidgets from '../../components/ProfileWidgets';


const ProfilePage = () => {
  const router = useRouter();
  const { username } = router.query;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;

    const fetchProfile = async () => {
      try {
        let endpoint;
        if (username === 'me') {
          endpoint = '/profiles/me/';
        } else {
          endpoint = `/profiles/${username}/`;
        }
        
        const response = await apiClient.get(endpoint);
        console.log('Profile data:', response.data); // Debug log
        setProfile(response.data);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(username === 'me' ? 'Could not load your profile.' : 'Profile not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [username]);

  const handleLayoutChange = async (layouts) => {
    if (username !== 'me') return;
    
    try {
      await apiClient.patch('/profiles/me/', {
        widget_layout: layouts
      });
    } catch (error) {
      console.error('Error saving layout:', error);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );

  const isOwner = username === 'me';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Profile Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {profile.profile?.profile_picture_url && (
                  <img
                    src={profile.profile.profile_picture_url}
                    alt={profile.username}
                    className="w-20 h-20 rounded-full mr-4"
                  />
                )}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    {profile.username || 'User'}
                  </h1>
                  <p className="text-gray-600">
                    {profile.first_name || ''} {profile.last_name || ''}
                  </p>
                </div>
              </div>
              
              {isOwner && (
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push('/complete-profile')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Widgets */}
        <ProfileWidgets
          profile={profile.profile || {}} // Ensure profile.profile exists
          isOwner={isOwner}
          onLayoutChange={handleLayoutChange}
        />
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
