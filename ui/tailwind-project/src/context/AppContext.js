import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  user: null,
  theme: 'dark',
  notifications: [],
  loading: false,
  error: null
};

// Action types
export const APP_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_USER: 'SET_USER',
  SET_THEME: 'SET_THEME',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS'
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case APP_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case APP_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
      
    case APP_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    case APP_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload
      };
      
    case APP_ACTIONS.SET_THEME:
      return {
        ...state,
        theme: action.payload
      };
      
    case APP_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, {
          id: Date.now(),
          ...action.payload
        }]
      };
      
    case APP_ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        )
      };
      
    case APP_ACTIONS.CLEAR_NOTIFICATIONS:
      return {
        ...state,
        notifications: []
      };
      
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Context provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators
  const setLoading = (loading) => {
    dispatch({ type: APP_ACTIONS.SET_LOADING, payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: APP_ACTIONS.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: APP_ACTIONS.CLEAR_ERROR });
  };

  const setUser = (user) => {
    dispatch({ type: APP_ACTIONS.SET_USER, payload: user });
  };

  const setTheme = (theme) => {
    dispatch({ type: APP_ACTIONS.SET_THEME, payload: theme });
  };

  const addNotification = (notification) => {
    dispatch({ type: APP_ACTIONS.ADD_NOTIFICATION, payload: notification });
  };

  const removeNotification = (id) => {
    dispatch({ type: APP_ACTIONS.REMOVE_NOTIFICATION, payload: id });
  };

  const clearNotifications = () => {
    dispatch({ type: APP_ACTIONS.CLEAR_NOTIFICATIONS });
  };

  const showNotification = (message, type = 'info', duration = 5000) => {
    const notification = {
      message,
      type,
      duration,
      timestamp: new Date().toISOString()
    };
    addNotification(notification);
    
    // Auto remove notification
    setTimeout(() => {
      removeNotification(notification.id);
    }, duration);
  };

  const contextValue = {
    // State
    ...state,
    
    // Actions
    setLoading,
    setError,
    clearError,
    setUser,
    setTheme,
    addNotification,
    removeNotification,
    clearNotifications,
    showNotification
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use app context
export const useApp = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  
  return context;
};

export default AppContext;
