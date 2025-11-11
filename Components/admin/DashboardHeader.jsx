'use client';

import { useState, useEffect } from 'react';
import { getUserFirstName, getUserEmail, getUserRole, getUserInitials, logout } from '@/lib/adminAuth.js';

export default function DashboardHeader() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    email: '',
    role: '',
    initials: ''
  });

  useEffect(() => {
    // Get user data on mount
    setUserData({
      firstName: getUserFirstName(),
      email: getUserEmail(),
      role: getUserRole(),
      initials: getUserInitials()
    });

    // Update on auth changes
    const handleAuthChange = () => {
      setUserData({
        firstName: getUserFirstName(),
        email: getUserEmail(),
        role: getUserRole(),
        initials: getUserInitials()
      });
    };

    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
    }
  };

  return (
    <header className="border-b border-black/10 bg-white sticky top-0 z-30">
      <div className="px-6 md:px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extralight tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-black/40 mt-1">
              Welcome back, {userData.firstName}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="w-10 h-10 flex items-center justify-center hover:bg-black/5 transition-colors relative rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-black rounded-full" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-10 h-10 bg-black text-white flex items-center justify-center text-sm font-medium hover:bg-black/90 transition-colors rounded-full"
              >
                {userData.initials}
              </button>

              {showDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-10"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-black/10 shadow-xl z-20 rounded-lg overflow-hidden">
                    {/* User Info */}
                    <div className="p-4 border-b border-black/10">
                      <p className="text-sm font-medium truncate">{userData.firstName}</p>
                      <p className="text-xs text-black/40 mt-1 truncate">{userData.email}</p>
                      <div className="mt-2 inline-block px-2 py-1 bg-black text-white text-xs font-medium tracking-wider uppercase rounded">
                        {userData.role}
                      </div>
                    </div>
                    
                    {/* Menu Items */}
                    <div className="p-2">
                      <a 
                        href="/profile"
                        className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-black/5 transition-colors rounded"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </a>

                      <a 
                        href="/admin/settings"
                        className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-black/5 transition-colors rounded"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                      </a>

                      <div className="border-t border-black/10 my-2" />

                      <button 
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm hover:bg-red-50 transition-colors rounded text-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}