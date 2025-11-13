'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isAuthenticated, isAdmin } from '@/lib/adminAuth.js';
import DashboardHeader from '../../../Components/admin/DashboardHeader';
import ProductsGrid from '../../../Components/admin/ProductsGrid';
import ProductsStats from '../../../Components/admin/ProductsStats';
import ProductsFilters from '../../../Components/admin/ProductsFilters';
import ProductsAnalytics from '../../../Components/admin/ProductsAnalytics';

export default function ProductsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [view, setView] = useState('grid');
  const [filters, setFilters] = useState({});

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

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

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
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2">Products Management</h1>
            <p className="text-sm md:text-base text-black/50">Manage your anime gift collection</p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-white border border-black/10 rounded-lg p-1">
              <button
                onClick={() => setView('grid')}
                className={`p-2 rounded-md transition-all duration-300 ${
                  view === 'grid' ? 'bg-black text-white' : 'text-black/40 hover:text-black'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded-md transition-all duration-300 ${
                  view === 'list' ? 'bg-black text-white' : 'text-black/40 hover:text-black'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>

            {/* Add Product Button */}
            <Link
              href="/admin/products/add"
              className="bg-black text-white px-6 py-3 rounded-xl font-medium hover:bg-black/90 transition-all duration-300 hover:shadow-lg inline-flex items-center gap-2 group"
            >
              <span className="text-xl">+</span>
              <span>Add Product</span>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <ProductsStats />

        {/* Analytics Charts */}
        <ProductsAnalytics />

        {/* Filters */}
        <ProductsFilters onFilterChange={handleFilterChange} />

        {/* Products Grid/List */}
        <ProductsGrid view={view} filters={filters} />
      </main>
    </div>
  );
}