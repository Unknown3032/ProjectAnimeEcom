'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isAdmin, getUser } from '@/lib/adminAuth.js';
// import DashboardHeader from '@/components/admin/DashboardHeader';
// import StatsCard from '@/components/admin/StatsCard';
// import RecentOrders from '@/components/admin/RecentOrders';
// import TopProducts from '@/components/admin/TopProducts';
// import SalesGraph from '@/components/admin/SalesGraph';
// import { dashboardStats } from '@/lib/dashboardData';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      // console.log('❌ Not authenticated - redirecting to signin');
      router.replace('/signin');
      return;
    }

    // Check if admin
    if (!isAdmin()) {
      // console.log('❌ Not admin - redirecting to home');
      router.replace('/');
      return;
    }

    // console.log('✅ Admin access granted');
    setAuthorized(true);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-black/40 tracking-wider uppercase">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-white via-white to-black/5 min-h-screen overflow-auto">
      {/* <DashboardHeader /> */}

      <main className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {dashboardStats.map((stat, index) => (
            <StatsCard key={stat.id} stat={stat} index={index} />
          ))}
        </div>

        {/* Sales Graph - Full Width */}
        <div className="w-full">
          {/* <SalesGraph /> */}
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* <RecentOrders /> */}
          </div>
          <div className="space-y-6">
            {/* <TopProducts /> */}
          </div>
        </div>
      </main>
    </div>
  );
}