// context/AppContext.js
import { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

// Action types
const SET_LOADING = 'SET_LOADING';
const SET_ERROR = 'SET_ERROR';
const CLEAR_ERROR = 'CLEAR_ERROR';
const SET_SUCCESS_MESSAGE = 'SET_SUCCESS_MESSAGE';
const CLEAR_SUCCESS_MESSAGE = 'CLEAR_SUCCESS_MESSAGE';

// Initial state
const initialState = {
  loading: false,
  error: null,
  successMessage: null,
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case SET_LOADING:
      return { ...state, loading: action.payload };
    case SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case CLEAR_ERROR:
      return { ...state, error: null };
    case SET_SUCCESS_MESSAGE:
      return { ...state, successMessage: action.payload };
    case CLEAR_SUCCESS_MESSAGE:
      return { ...state, successMessage: null };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setLoading = (loading) => {
    dispatch({ type: SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: CLEAR_ERROR });
  };

  const setSuccessMessage = (message) => {
    dispatch({ type: SET_SUCCESS_MESSAGE, payload: message });
    // Auto-clear after 3 seconds
    setTimeout(() => {
      dispatch({ type: CLEAR_SUCCESS_MESSAGE });
    }, 3000);
  };

  const value = {
    ...state,
    setLoading,
    setError,
    clearError,
    setSuccessMessage,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
