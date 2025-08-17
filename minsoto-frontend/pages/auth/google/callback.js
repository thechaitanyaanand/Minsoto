// minsoto-frontend/pages/auth/google/callback.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import apiClient from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext';

const GoogleCallback = () => {
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const { code } = router.query;
    
    if (code) {
      // URL decode the authorization code
      const decodedCode = decodeURIComponent(code);
      
      console.log('Original code:', code);
      console.log('Decoded code:', decodedCode);
      
      apiClient
        .post('/auth/google/', { 
          code: decodedCode  // Use decoded code
        })
        .then((response) => {
          console.log('Google login response:', response.data);
          
          // Extract user data and tokens properly
          const { user, access_token, refresh_token } = response.data;
          
          // Pass them separately to the login function  
          login({ user }, { access_token, refresh_token });
        })
        .catch((error) => {
          console.error('Login failed:', error);
          if (error.response) {
            console.error('Error response:', error.response.data);
            console.error('Error status:', error.response.status);
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
