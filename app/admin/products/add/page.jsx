'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isAdmin } from '@/lib/adminAuth.js';
import DashboardHeader from '@/components/admin/DashboardHeader';
import AddProductForm from '@/components/admin/AddProductForm';

export default function AddProductPage() {
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
      
      <main className="p-4 md:p-6 lg:p-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black mb-3 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              Back to Products
            </button>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2">
              Add New Product
            </h1>
            <p className="text-sm md:text-base text-black/50">
              Create a new anime gift product for your store
            </p>
          </div>
        </div>

        {/* Add Product Form */}
        <AddProductForm />
      </main>
    </div>
  );
}