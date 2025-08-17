// minsoto-frontend/pages/auth/google/callback.js
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import apiClient from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';

const GoogleCallback = () => {
  const router = useRouter();
  const { login } = useAuth();
  const hasProcessed = useRef(false); // Prevent double execution

  useEffect(() => {
    const { code } = router.query;
    
    if (code && !hasProcessed.current) {
      hasProcessed.current = true; // Mark as processed
      
      console.log('Processing Google login with code:', code);
      
      apiClient
        .post('/auth/google/', { 
          code: code // Don't decode - let Django handle it
        })
        .then((response) => {
          console.log('Google login success:', response.data);
          
          // Extract tokens properly based on dj-rest-auth response format
          const { user, access_token, refresh_token, access, refresh } = response.data;
          
          // Handle different response formats
          const tokens = {
            access_token: access_token || access,
            refresh_token: refresh_token || refresh
          };
          
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

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column'
    }}>
      <div>Processing your login...</div>
      <div style={{ marginTop: '20px' }}>Please wait...</div>
    </div>
  );
};

export default GoogleCallback;
