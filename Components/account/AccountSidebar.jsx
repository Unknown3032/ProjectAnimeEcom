'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import authService from '@/services/authService';

const AccountSidebar = ({ user, activeSection, onSectionChange }) => {
  const sidebarRef = useRef(null);

  const menuItems = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'orders', label: 'Orders', icon: '📦', badge: '12' },
    { id: 'addresses', label: 'Addresses', icon: '📍' },
    { id: 'wishlist', label: 'Wishlist', icon: '❤️', badge: '8' },
    { id: 'loyalty', label: 'Rewards', icon: '⭐' },
    { id: 'security', label: 'Security', icon: '🔒' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sidebarRef.current?.children || [], {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
      });
    }, sidebarRef);

    return () => ctx.revert();
  }, []);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      authService.logout();
    }
  };

  return (
    <div ref={sidebarRef} className="space-y-6">
      {/* User Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-black to-black/90 p-6 text-white">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />
        
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl mb-4 border-2 border-white/30">
            { '👤'}
          </div>
          
          <h3 className="font-bold text-lg mb-1 truncate">
            {user?.fullName || user?.firstName || 'User'}
          </h3>
          <p className="text-sm text-white/70 truncate mb-4">{user?.email}</p>

          <div className="flex items-center justify-between pt-4 border-t border-white/20">
            <div className="text-center">
              <p className="text-2xl font-bold">{user?.loyaltyPoints || 0}</p>
              <p className="text-xs text-white/70">Points</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold">${user?.totalSpent?.toFixed(0) || 0}</p>
              <p className="text-xs text-white/70">Spent</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={`w-full group flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              activeSection === item.id
                ? 'bg-black text-white'
                : 'text-black/60 hover:bg-black/5 hover:text-black'
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="text-lg transition-transform group-hover:scale-110">{item.icon}</span>
              <span>{item.label}</span>
            </span>
            {item.badge && (
              <span className={`min-w-[24px] h-6 px-2 flex items-center justify-center rounded-full text-xs font-bold transition-all ${
                activeSection === item.id
                  ? 'bg-white text-black'
                  : 'bg-black/10 text-black/60'
              }`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-300 group"
      >
        <span className="text-lg transition-transform group-hover:translate-x-1">🚪</span>
        <span>Logout</span>
      </button>
    </div>
  );
};

export default AccountSidebar;