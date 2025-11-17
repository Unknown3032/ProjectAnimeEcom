'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import authService from '@/services/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    // Listen for storage changes (for multi-tab sync)
    const handleStorageChange = () => {
      const updatedUser = authService.getCurrentUser();
      setUser(updatedUser);
      
      // Dispatch event for cart to listen
      if (!updatedUser) {
        window.dispatchEvent(new Event('userSignedOut'));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    setUser(response.data);
    
    // Dispatch event for cart to sync
    window.dispatchEvent(new CustomEvent('userSignedIn', { 
      detail: { user: response.data } 
    }));
    
    return response;
  };

  const signup = async (userData) => {
    const response = await authService.signup(userData);
    
    // If signup automatically logs in the user
    if (response.data) {
      setUser(response.data);
      window.dispatchEvent(new CustomEvent('userSignedIn', { 
        detail: { user: response.data } 
      }));
    }
    
    return response;
  };

  const logout = () => {
    // Dispatch event BEFORE clearing user
    window.dispatchEvent(new Event('userSignedOut'));
    
    authService.logout();
    setUser(null);
  };

  const updateUser = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.data);
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateUser,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}