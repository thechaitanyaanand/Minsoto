// minsoto-frontend/pages/profile/[username].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import apiClient from '../../lib/api';

const ProfilePage = () => {
  const router = useRouter();
  const { username } = router.query; // Get username from the URL, e.g., "johndoe"
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the profile data when the username is available from the router
    if (username) {
      apiClient.get(`/profiles/${username}/`)
        .then(response => {
          setProfile(response.data);
          setLoading(false);
        })
        .catch(err => {
          setError('Profile not found.');
          setLoading(false);
        });
    }
  }, [username]);

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>{error}</div>;
  if (!profile) return <div>Profile not found.</div>;

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Profile Header (Picture, Name, Bio) */}
      <header className="p-8 border-b border-gray-800">
        <img 
          src={profile.profile.profile_picture_url || '/default-avatar.png'} 
          alt={`${profile.username}'s profile picture`}
          className="w-32 h-32 rounded-full mx-auto"
        />
        <h1 className="text-center text-4xl font-bold mt-4">{profile.username}</h1>
        <p className="text-center text-gray-400 mt-2">{profile.profile.bio}</p>
      </header>
      
      {/* Customizable Widget Grid will go here */}
      <main className="p-8">
        <h2 className="text-2xl font-semibold">My Canvas</h2>
        {/* We will add the grid component in the next step */}
      </main>
    </div>
  );
};

export default ProfilePage;