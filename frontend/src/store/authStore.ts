import { create } from 'zustand';
import axios, { AxiosError } from 'axios'; // Import AxiosError for type checking
import { persist } from 'zustand/middleware';

const API_URL = 'http://127.0.0.1:8000'; // Your Django backend URL

interface User {
  id: number;
  username: string;
  email: string;
  // Add other user fields from your UserSerializer as needed
}

// A type for the expected structure of Django REST Framework validation errors
type DjangoValidationErrors = {
  [field: string]: string[];
};

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
          const response = await axios.post(`${API_URL}/api/auth/login/`, {
            email, 
            password,
          });
          const { access_token, refresh_token, user } = response.data;
          set({ accessToken: access_token, refreshToken: refresh_token, user, isAuthenticated: true });
          axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
          return { success: true };
        } catch (error) { // Type 'error' as unknown
            if (error instanceof AxiosError && error.response) {
                const errorData = error.response.data as DjangoValidationErrors;
                // Get the first error message from the response
                const errorMessage = Object.values(errorData).flat()[0] || 'Login failed. Please check your credentials.';
                return { success: false, error: errorMessage };
            }
            return { success: false, error: 'An unexpected error occurred.' };
        }
      },
      
      loginWithGoogle: async (idToken) => {
        try {
          const response = await axios.post(`${API_URL}/api/auth/google/`, {
            id_token: idToken,
          });
          const { access_token, refresh_token, user } = response.data;
          set({ accessToken: access_token, refreshToken: refresh_token, user, isAuthenticated: true });
          axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
          return { success: true };
        } catch (_error) { // Use `_error` to silence the 'unused variable' warning
          return { success: false, error: 'Google login failed on our server. Please ensure the Google People API is enabled in your cloud console.' };
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
        } catch (error) { // Type 'error' as unknown
            if (error instanceof AxiosError && error.response) {
                const errorData = error.response.data as DjangoValidationErrors;
                const errorMessage = Object.values(errorData).flat().join(' ');
                return { success: false, error: errorMessage || 'Registration failed.' };
            }
            return { success: false, error: 'An unexpected error occurred.' };
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