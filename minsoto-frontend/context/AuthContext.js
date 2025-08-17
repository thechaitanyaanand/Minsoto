// minsoto-frontend/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import apiClient from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  // On component mount, check if user is already logged in
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (accessToken || refreshToken) {
        try {
          // Try to fetch user details with current token
          const response = await apiClient.get('/auth/user/');
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token validation failed:', error);
          // If token validation fails, try to refresh
          if (refreshToken) {
            try {
              const refreshResponse = await apiClient.post('/auth/token/refresh/', {
                refresh: refreshToken,
              });
              
              const newAccessToken = refreshResponse.data.access;
              localStorage.setItem('accessToken', newAccessToken);
              
              // Try fetching user details again with new token
              const userResponse = await apiClient.get('/auth/user/');
              setUser(userResponse.data);
              setIsAuthenticated(true);
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              // If refresh also fails, logout the user
              logout();
            }
          } else {
            // No refresh token, so logout
            logout();
          }
        }
      }
      
      setLoading(false);
    };

    checkUserLoggedIn();
  }, []);

  const login = (userData, tokens) => {
    try {
      console.log('Login called with:', { userData, tokens });
      
      // Store tokens in localStorage
      if (tokens.access_token) {
        localStorage.setItem('accessToken', tokens.access_token);
      }
      if (tokens.refresh_token) {
        localStorage.setItem('refreshToken', tokens.refresh_token);
      }

      // Set user data
      setUser(userData.user);
      setIsAuthenticated(true);

      // Redirect based on whether they need to set a username
      if (userData.user.username_is_default) {
        router.push('/complete-profile');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error in login function:', error);
      router.push('/login-error');
    }
  };

  const logout = () => {
    // Try to logout on server (don't wait for response)
    apiClient.post('/auth/logout/').catch(() => {
      console.log('Server logout failed, but continuing with client logout');
    });

    // Clear local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
    
    // Redirect to login page
    router.push('/login');
  };

  const updateUser = (updatedUserData) => {
    setUser(prev => ({ ...prev, ...updatedUserData }));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
