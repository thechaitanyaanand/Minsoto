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

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      console.log('=== Auth Check Started ===');
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      console.log('Access token exists:', !!accessToken);
      console.log('Refresh token exists:', !!refreshToken);
      
      if (accessToken) {
        console.log('Access token preview:', accessToken.substring(0, 50) + '...');
        
        try {
          console.log('Fetching user data...');
          const response = await apiClient.get('/auth/user/');
          console.log('User fetch successful:', response.data);
          
          setUser(response.data);
          setIsAuthenticated(true);
          
          // Handle redirects
          if (router.pathname === '/login' || router.pathname === '/register') {
            if (response.data.username_is_default) {
              console.log('Redirecting to complete-profile');
              router.replace('/complete-profile');
            } else {
              console.log('Redirecting to dashboard');
              router.replace('/dashboard');
            }
          }
        } catch (error) {
          console.error('User fetch failed:', error.response?.status, error.response?.data);
          
          if (refreshToken && error.response?.status === 401) {
            console.log('Attempting token refresh...');
            try {
              const refreshResponse = await apiClient.post('/auth/token/refresh/', { 
                refresh: refreshToken 
              });
              const newAccessToken = refreshResponse.data.access;
              localStorage.setItem('accessToken', newAccessToken);
              console.log('Token refresh successful');
              
              const userResponse = await apiClient.get('/auth/user/');
              setUser(userResponse.data);
              setIsAuthenticated(true);
              
              if (router.pathname === '/login' || router.pathname === '/register') {
                if (userResponse.data.username_is_default) {
                  router.replace('/complete-profile');
                } else {
                  router.replace('/dashboard');
                }
              }
            } catch (refreshError) {
              console.error('Token refresh failed:', refreshError);
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');
              setUser(null);
              setIsAuthenticated(false);
              if (router.pathname !== '/login' && router.pathname !== '/register') {
                router.replace('/login');
              }
            }
          } else {
            console.log('No refresh token or non-401 error, clearing auth');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setUser(null);
            setIsAuthenticated(false);
            if (router.pathname !== '/login' && router.pathname !== '/register') {
              router.replace('/login');
            }
          }
        }
      } else {
        console.log('No access token found');
        setUser(null);
        setIsAuthenticated(false);
        if (router.pathname !== '/login' && router.pathname !== '/register') {
          router.replace('/login');
        }
      }
      
      setLoading(false);
      console.log('=== Auth Check Complete ===');
    };

    checkUserLoggedIn();
  }, [router.pathname]);

  const login = (userData, tokens) => {
    console.log('=== Login Function Called ===');
    console.log('User data:', userData);
    console.log('Tokens received:', tokens);
    
    try {
      if (tokens.access_token) {
        localStorage.setItem('accessToken', tokens.access_token);
        console.log('Access token stored');
      } else {
        console.error('No access_token in tokens object!');
        throw new Error('No access token received');
      }
      
      if (tokens.refresh_token) {
        localStorage.setItem('refreshToken', tokens.refresh_token);
        console.log('Refresh token stored');
      }

      setUser(userData.user);
      setIsAuthenticated(true);

      if (userData.user.username_is_default) {
        console.log('Username is default, redirecting to complete-profile');
        router.push('/complete-profile');
      } else {
        console.log('Username set, redirecting to dashboard');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login function error:', error);
      router.push('/login-error');
    }
  };

  const logout = () => {
    console.log('Logging out...');
    apiClient.post('/auth/logout/').catch(() => {});
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
    setIsAuthenticated(false);
    router.replace('/login');
  };

  const updateUser = (updatedUserData) => {
    setUser((prev) => ({ ...prev, ...updatedUserData }));
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
