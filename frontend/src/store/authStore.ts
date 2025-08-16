import { create } from 'zustand';
import axios from 'axios';
import { persist } from 'zustand/middleware';

const API_URL = 'http://127.0.0.1:8000'; // Your Django backend URL

interface User {
  id: number;
  username: string;
  email: string;
  // Add other user fields from your UserSerializer as needed
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (idToken: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, username: string, password: string, password2: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,

      login: async (email, password) => {
        try {
          // *** THE FIX IS HERE: Changed URL from /token/ to /login/ ***
          const response = await axios.post(`${API_URL}/api/auth/login/`, {
            email, 
            password,
          });
          // dj-rest-auth returns tokens and user data in a different structure
          const { access_token, refresh_token, user } = response.data;
          set({ accessToken: access_token, refreshToken: refresh_token, user, isAuthenticated: true });
          axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
          return { success: true };
        } catch (error: any) {
          const errorData = error.response?.data;
          // Flatten potential nested error messages
          const errorMessage = Object.values(errorData).flat().join(' ');
          return { success: false, error: errorMessage || 'Login failed. Please check your credentials.' };
        }
      },
      
      // (The rest of the file is the same as before)

      loginWithGoogle: async (idToken) => {
        try {
          const response = await axios.post(`${API_URL}/api/auth/google/`, {
            access_token: idToken,
          });
          const { access_token, refresh_token, user } = response.data;
          set({ accessToken: access_token, refreshToken: refresh_token, user, isAuthenticated: true });
          axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
          return { success: true };
        } catch (error: any) {
          return { success: false, error: 'Google login failed on our server.' };
        }
      },

      register: async (email, username, password, password2) => {
        try {
          await axios.post(`${API_URL}/api/auth/registration/`, {
            email,
            username,
            password,
            password2,
          });
          return { success: true };
        } catch (error: any) {
          const errorData = error.response?.data;
          const errorMessage = Object.entries(errorData).map(([key, value]) => `${key}: ${(value as string[]).join(', ')}`).join(' ');
          return { success: false, error: errorMessage || 'Registration failed.' };
        }
      },

      logout: () => {
        set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false });
        delete axios.defaults.headers.common['Authorization'];
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;