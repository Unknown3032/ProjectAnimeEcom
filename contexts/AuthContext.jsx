'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import authService from '@/services/authService';
import { useCart } from './CartContext';

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
  const { syncCartWithServer, clearCart } = useCart();

  useEffect(() => {
    // Check if user is logged in
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);

    // Sync cart with server if logged in
    if (currentUser) {
      syncCartWithServer();
    }

    // Listen for storage changes (for multi-tab sync)
    const handleStorageChange = () => {
      const updatedUser = authService.getCurrentUser();
      setUser(updatedUser);
    };

    // Listen for custom auth events
    const handleAuthChange = (event) => {
      if (event.detail.type === 'login') {
        setUser(event.detail.user);
        syncCartWithServer();
      } else if (event.detail.type === 'logout') {
        setUser(null);
        clearCart();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, [syncCartWithServer, clearCart]);

  const login = async (credentials) => {
    const response = await authService.login(credentials);
    setUser(response.data);
    
    // Sync cart after login
    await syncCartWithServer();
    
    return response;
  };

  const signup = async (userData) => {
    const response = await authService.signup(userData);
    return response;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    clearCart();
  };

  const updateUser = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.data);
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
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