import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If the auth state is done loading and the user is not authenticated, redirect
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  // If loading, show a loading indicator
  if (loading) {
    return <div>Loading...</div>; // Or a nice spinner component
  }

  // If authenticated, render the children (the protected page)
  // We also check isAuthenticated again in case the redirect hasn't happened yet
  return isAuthenticated ? children : null; 
};

export default ProtectedRoute;