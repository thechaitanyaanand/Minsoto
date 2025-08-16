// pages/auth/google/callback.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import apiClient from '../../../lib/api';

const GoogleCallback = () => {
  const router = useRouter();

  useEffect(() => {
    const { code } = router.query;

    if (code) {
      apiClient
        .post('/auth/google/', { code: code }) // dj-rest-auth expects the code here
        .then((response) => {
          // The backend response will contain JWT access and refresh tokens
          const { access_token, refresh_token, user } = response.data;

          // **VERY IMPORTANT**: In a real app, store tokens securely.
          // HttpOnly cookies are the best practice. For simplicity here, we use localStorage.
          localStorage.setItem('accessToken', access_token);
          localStorage.setItem('refreshToken', refresh_token);
          
          // Now we check if the user needs to set a username
          // We'll need to adapt the backend to return a flag for this.
          // Let's assume the backend returns `user.username_is_default`
          if (user.username_is_default) {
             router.push('/complete-profile');
          } else {
             router.push('/dashboard'); // Redirect to a protected page
          }
        })
        .catch((error) => {
          console.error('Login failed:', error);
          router.push('/login-error'); // Redirect to an error page
        });
    }
  }, [router.query]);

  return <div>Loading...</div>; // Show a loading indicator
};

export default GoogleCallback;