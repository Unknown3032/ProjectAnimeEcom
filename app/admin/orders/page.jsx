'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isAdmin } from '@/lib/adminAuth.js';
// import DashboardHeader from '@/components/admin/DashboardHeader';
// import OrdersTable from '@/components/admin/OrdersTable';
// import OrdersStats from '@/components/admin/OrdersStats';
// import OrdersFilters from '@/components/admin/OrdersFilters';
// import OrdersChart from '@/components/admin/OrdersChart';
// import OrdersAnalytics from '@/components/admin/OrdersAnalytics';

export default function OrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/signin');
      return;
    }

    if (!isAdmin()) {
      router.replace('/');
      return;
    }

    setAuthorized(true);
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-black/40 tracking-wider uppercase">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  return (
    // <div className="flex-1 bg-gradient-to-br from-white via-white to-black/5 min-h-screen overflow-auto">
    //   <DashboardHeader />
      
    //   <main className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
    //     {/* Page Header */}
    //     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
    //       <div>
    //         <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2">
    //           Orders Management
    //         </h1>
    //         <p className="text-sm md:text-base text-black/50">
    //           Track and manage all customer orders
    //         </p>
    //       </div>
          
    //       <button className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-black/90 transition-all duration-300 hover:shadow-lg inline-flex items-center gap-2 group w-fit">
    //         <span>Export Orders</span>
    //         <span className="group-hover:translate-x-1 transition-transform">→</span>
    //       </button>
    //     </div>

    //     {/* Stats Overview */}
    //     <OrdersStats />

    //     {/* Charts Section */}
    //     <div className="grid lg:grid-cols-3 gap-6">
    //       <div className="lg:col-span-2">
    //         <OrdersChart />
    //       </div>
    //       <div>
    //         <OrdersAnalytics />
    //       </div>
    //     </div>

    //     {/* Filters */}
    //     <OrdersFilters />

    //     {/* Orders Table */}
    //     <OrdersTable />
    //   </main>
    // </div>
    <></>
  );
}