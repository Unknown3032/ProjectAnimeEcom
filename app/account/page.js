'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import authService from '@/services/authService';
import AccountSidebar from '../../Components/account/AccountSidebar';
import ProfileSection from '../../Components/account/ProfileSection';
import OrdersSection from '../../Components/account/OrdersSection';
import AddressesSection from '../../Components/account/AddressesSection';
import WishlistSection from '../../Components/account/WishlistSection';
import SecuritySection from '../../Components/account/SecuritySection';
import LoyaltySection from '../../Components/account/LoyaltySection';

export default function MyAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('profile');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check authentication
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.replace('/signin');
      return;
    }

    setUser(currentUser);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-black/40 tracking-wider">Loading your account...</p>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection user={user} setUser={setUser} />;
      case 'orders':
        return <OrdersSection />;
      case 'addresses':
        return <AddressesSection />;
      case 'wishlist':
        return <WishlistSection />;
      case 'security':
        return <SecuritySection />;
      case 'loyalty':
        return <LoyaltySection user={user} />;
      default:
        return <ProfileSection user={user} setUser={setUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-black/10">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
          >
            <span className="text-xl">←</span>
          </button>
          <h1 className="text-lg font-bold text-black">My Account</h1>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 transition-colors"
          >
            <span className="text-xl">{mobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex min-h-screen">
          {/* Sidebar - Desktop */}
          <aside className="hidden lg:block w-80 border-r border-black/10 bg-white sticky top-0 h-screen overflow-y-auto">
            <div className="p-8">
              <AccountSidebar 
                user={user}
                activeSection={activeSection}
                onSectionChange={setActiveSection}
              />
            </div>
          </aside>

          {/* Mobile Sidebar */}
          {mobileMenuOpen && (
            <div className="lg:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
              <div className="w-80 h-full bg-white" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-black">Menu</h2>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5"
                    >
                      <span className="text-xl">✕</span>
                    </button>
                  </div>
                  <AccountSidebar 
                    user={user}
                    activeSection={activeSection}
                    onSectionChange={(section) => {
                      setActiveSection(section);
                      setMobileMenuOpen(false);
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6 lg:p-8 xl:p-12">
              {renderSection()}
            </div>
          </main>
        </div>
      </div>
    </div>
    
  );
}