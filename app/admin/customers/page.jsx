'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isAdmin } from '@/lib/adminAuth.js';
import DashboardHeader from '../../../Components/admin/DashboardHeader';
import CustomersTable from '../../../Components/admin/CustomersTable';
import CustomersStats from '../../../Components/admin/CustomersStats';
import CustomersFilters from '../../../Components/admin/CustomersFilters';
import CustomersAnalytics from '../../../Components/admin/CustomersAnalytics';

export default function CustomersPage() {
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
    <div className="flex-1 bg-gradient-to-br from-white via-white to-black/5 min-h-screen overflow-auto">
      <DashboardHeader />
      
      <main className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2">
              Customers Management
            </h1>
            <p className="text-sm md:text-base text-black/50">
              Manage and engage with your customer base
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="bg-black/5 text-black px-6 py-3 rounded-xl font-medium hover:bg-black/10 transition-all duration-300 inline-flex items-center gap-2">
              <span>📊</span>
              <span>Export Data</span>
            </button>
            
            <button className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-black/90 transition-all duration-300 hover:shadow-lg inline-flex items-center gap-2 group">
              <span>✉️</span>
              <span>Send Email</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <CustomersStats />

        {/* Analytics Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CustomersAnalytics />
          </div>
          <div>
            <TopCustomers />
          </div>
        </div>

        {/* Filters */}
        <CustomersFilters />

        {/* Customers Table */}
        <CustomersTable />
      </main>
    </div>
  );
}

// Top Customers Component
function TopCustomers() {
  const topCustomers = [
    { name: 'Sakura Tanaka', avatar: '👤', orders: 45, spent: 3420 },
    { name: 'Yuki Nakamura', avatar: '👤', orders: 38, spent: 2890 },
    { name: 'Hiro Yamamoto', avatar: '👤', orders: 32, spent: 2650 },
    { name: 'Aiko Sato', avatar: '👤', orders: 28, spent: 2340 },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-black/5">
      <h3 className="text-xl font-bold text-black mb-6">Top Customers</h3>
      
      <div className="space-y-4">
        {topCustomers.map((customer, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-xl hover:bg-black/5 transition-colors cursor-pointer">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
              {index + 1}
            </div>
            
            <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center text-2xl flex-shrink-0">
              {customer.avatar}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-black truncate">{customer.name}</p>
              <p className="text-xs text-black/50">{customer.orders} orders</p>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-bold text-black">${customer.spent.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all">
        View All Customers
      </button>
    </div>
  );
}