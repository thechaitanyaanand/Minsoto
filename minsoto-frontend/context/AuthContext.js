import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import apiClient from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // On component mount, check if user is already logged in
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          // You could verify the token by fetching user details
          // For now, let's assume if refresh token exists, we can get user info
          const response = await apiClient.get('/auth/user/');
          setUser(response.data);
        } catch (error) {
          // Token might be expired or invalid, so log them out
          logout();
        }
      }
      setLoading(false);
    };
    checkUserLoggedIn();
  }, []);

  const login = (userData, tokens) => {
    localStorage.setItem('accessToken', tokens.access_token);
    localStorage.setItem('refreshToken', tokens.refresh_token);
    setUser(userData.user);

    // Redirect based on whether they need to set a username
    if (userData.user.username_is_default) {
      router.push('/complete-profile');
    } else {
      router.push('/dashboard');
    }
  };

  const logout = () => {
    apiClient.post('/auth/logout/').catch(() => {}); // Try to logout on server
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    router.push('/login'); // Redirect to login page
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);