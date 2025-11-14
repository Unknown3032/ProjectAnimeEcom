'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isAdmin, getUserFullName } from '@/lib/adminAuth.js';
import { adminAPI } from '@/lib/api/adminApi';
import DashboardHeader from '@/Components/admin/DashboardHeader';
import StatsCard from '@/Components/admin/StatsCard';
import RecentOrders from '@/Components/admin/RecentOrders';
import TopProducts from '@/Components/admin/TopProducts';
import SalesGraph from '@/Components/admin/SalesGraph';
import RevenueByCategory from '@/Components/admin/RevenueByCategory';
import CustomerGrowth from '@/Components/admin/CustomerGrowth';
import OrderStatusChart from '@/Components/admin/OrderStatusChart';
import AvgOrderTrend from '@/Components/admin/AvgOrderTrend';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    salesData: [],
    orders: [],
    topProducts: [],
    analytics: null
  });
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      router.replace('/signin');
      return;
    }

    if (!isAdmin()) {
      router.replace('/');
      return;
    }

    setAuthorized(true);
    loadDashboardData();
  }, [router]);

  const loadDashboardData = async (showRefreshing = false) => {
    try {
      if (showRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Fetch all data in parallel
      const [stats, salesData, orders, topProducts, analytics] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getSalesData('30d'),
        adminAPI.getOrders({ limit: 10 }),
        adminAPI.getTopProducts(5, '30d'),
        adminAPI.getAnalytics()
      ]);

      setDashboardData({
        stats: stats.stats,
        additionalMetrics: stats.additionalMetrics,
        salesData: salesData.data,
        orders: orders.orders,
        topProducts: topProducts.products,
        analytics
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-black/40 tracking-wider uppercase">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center max-w-md">
          <div className="text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
          <p className="text-red-600 mb-4 text-sm">{error}</p>
          <button
            onClick={() => loadDashboardData()}
            className="px-6 py-2 bg-black text-white hover:bg-black/80 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-white via-white to-black/5 min-h-screen overflow-auto">
      <DashboardHeader 
        userName={getUserFullName()}
        onRefresh={() => loadDashboardData(true)}
        refreshing={refreshing}
      />

      <main className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {dashboardData.stats.map((stat, index) => (
            <StatsCard key={stat.id} stat={stat} index={index} />
          ))}
        </div>

        {/* Additional Quick Stats */}
        {dashboardData.additionalMetrics && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-black/10 p-4 hover:border-black/30 transition-colors">
              <p className="text-xs text-black/40 mb-1 tracking-wider uppercase">Total Products</p>
              <p className="text-2xl font-light">{dashboardData.additionalMetrics.totalProducts}</p>
            </div>
            <div className="bg-white border border-black/10 p-4 hover:border-black/30 transition-colors">
              <p className="text-xs text-black/40 mb-1 tracking-wider uppercase">Low Stock Items</p>
              <p className="text-2xl font-light text-red-600">{dashboardData.additionalMetrics.lowStock}</p>
            </div>
            <div className="bg-white border border-black/10 p-4 hover:border-black/30 transition-colors">
              <p className="text-xs text-black/40 mb-1 tracking-wider uppercase">Conversion Rate</p>
              <p className="text-2xl font-light">{dashboardData.additionalMetrics.conversionRate}</p>
            </div>
            <div className="bg-white border border-black/10 p-4 hover:border-black/30 transition-colors">
              <p className="text-xs text-black/40 mb-1 tracking-wider uppercase">Return Rate</p>
              <p className="text-2xl font-light">{dashboardData.additionalMetrics.returnRate}</p>
            </div>
          </div>
        )}

        {/* Sales Graph - Full Width */}
        <div className="w-full">
          <SalesGraph initialData={dashboardData.salesData} />
        </div>

        {/* Analytics Charts */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          <RevenueByCategory data={dashboardData.analytics?.revenueByCategory || []} />
          <OrderStatusChart data={dashboardData.analytics?.orderStatusDistribution || []} />
        </div>

        {/* Customer Growth & Avg Order Trend */}
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          <CustomerGrowth data={dashboardData.analytics?.customerGrowth || []} />
          <AvgOrderTrend data={dashboardData.analytics?.avgOrderTrend || []} />
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <RecentOrders 
              orders={dashboardData.orders} 
              onRefresh={() => loadDashboardData(true)} 
            />
          </div>
          <div className="space-y-6">
            <TopProducts products={dashboardData.topProducts} />
          </div>
        </div>
      </main>
    </div>
  );
}