'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  isUserAdmin, 
  getAdminUser, 
  isAuthenticated 
} from '@/lib/adminAuth';

export function useAdminAuth(redirectTo = '/signin') {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      console.log('🔍 Checking admin auth...');
      
      // Get user from localStorage
      const currentUser = getAdminUser();
      console.log('👤 Current user:', currentUser);
      
      // Check if user is authenticated (has _id)
      const authenticated = isAuthenticated();
      console.log('🔐 Is authenticated:', authenticated);
      
      // If not authenticated, redirect to signin
      if (!authenticated) {
        console.log('❌ Not authenticated, redirecting to signin...');
        router.replace(redirectTo);
        return;
      }

      // Check if user is admin
      const adminStatus = isUserAdmin();
      console.log('👑 Is admin:', adminStatus);
      
      if (!adminStatus) {
        console.log('⛔ Not admin, redirecting to access denied...');
        router.replace('/access-denied');
        return;
      }

      console.log('✅ Auth check passed!');
      setUser(currentUser);
      setIsAdmin(adminStatus);
      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const handleAuthChange = (e) => {
      console.log('🔄 Auth change detected:', e);
      checkAuth();
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, [router, redirectTo]);

  return { user, isAdmin, isLoading };
}