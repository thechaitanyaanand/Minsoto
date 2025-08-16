import { useEffect } from 'react';
import { useRouter } from 'next/router';
import apiClient from '../../../lib/api';
import { useAuth } from '../../../context/AuthContext'; // Import useAuth

const GoogleCallback = () => {
  const router = useRouter();
  const { login } = useAuth(); // Get the login function from context

  useEffect(() => {
    const { code } = router.query;

    if (code) {
      apiClient
        .post('/auth/google/', { code: code })
        .then((response) => {
          // The response now contains the user object and tokens
          // Let the login function from our context handle everything
          login(response.data, response.data);
        })
        .catch((error) => {
          console.error('Login failed:', error);
          router.push('/login-error');
        });
    }
  }, [router.query, login]); // Add login to the dependency array

  return <div>Loading...</div>;
};

export default GoogleCallback;