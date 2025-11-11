'use client';

import { useEffect, useState } from 'react';
import { 
  isUserAdmin, 
  getAdminUser,
  isAuthenticated,
  getUserId
} from '@/lib/adminAuth';

export default function AdminDebug() {
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    const info = {
      isAuthenticated: isAuthenticated(),
      isAdmin: isUserAdmin(),
      user: getAdminUser(),
      userId: getUserId(),
      timestamp: new Date().toISOString()
    };
    setDebugInfo(info);
    console.log('🐛 Admin Debug Info:', info);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;

  if (!debugInfo) return null;

  return (
    <div className="fixed bottom-4 left-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50 shadow-2xl">
      <div className="font-bold mb-2">🐛 Auth Debug</div>
      <div className="space-y-1">
        <div>Authenticated: {debugInfo.isAuthenticated ? '✅' : '❌'}</div>
        <div>Is Admin: {debugInfo.isAdmin ? '✅' : '❌'}</div>
        <div>User ID: {debugInfo.userId || 'None'}</div>
        <div>Role: {debugInfo.user?.role || 'None'}</div>
        <div className="text-xs opacity-50 mt-2">{debugInfo.timestamp}</div>
      </div>
    </div>
  );
}