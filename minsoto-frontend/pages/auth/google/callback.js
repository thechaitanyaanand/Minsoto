// minsoto-frontend/pages/auth/google/callback.js
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import apiClient from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';

const GoogleCallback = () => {
  const router = useRouter();
  const { login } = useAuth();
  const hasProcessed = useRef(false);

  useEffect(() => {
    const { code } = router.query;
    if (code && !hasProcessed.current) {
      hasProcessed.current = true;
      console.log('Processing Google login with code:', code);
      
      apiClient.post('/auth/google/', { code: code })
        .then((response) => {
          console.log('Google login success:', response.data);
          
          // Debug: Log the exact response structure
          console.log('Response keys:', Object.keys(response.data));
          
          // Extract tokens with multiple possible formats
          const { 
            user, 
            access_token, 
            refresh_token, 
            access, 
            refresh,
            key,  // dj-rest-auth sometimes uses 'key'
            token  // fallback
          } = response.data;
          
          const tokens = {
            access_token: access_token || access || key || token,
            refresh_token: refresh_token || refresh
          };
          
          console.log('Extracted tokens:', tokens);
          
          if (!tokens.access_token) {
            console.error('No access token found in response!');
            router.push('/login-error');
            return;
          }
          
          login({ user }, tokens);
        })
        .catch((error) => {
          console.error('Login failed:', error);
          if (error.response) {
            console.error('Error details:', error.response.data);
          }
          router.push('/login-error');
        });
    }
  }, [router.query, login, router]);

  return <div>Processing login...</div>;
};

export default GoogleCallback;
