'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, isAdmin } from '@/lib/adminAuth.js';
import DashboardHeader from '../../../../Components/admin/DashboardHeader';
import AddProductForm from '../../../../Components/admin/AddProductForm';
import toast from 'react-hot-toast';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      toast.error('Please login to continue');
      router.replace('/signin');
      return;
    }

    // Check admin authorization
    if (!isAdmin()) {
      toast.error('Unauthorized access - Admin only');
      router.replace('/');
      return;
    }

    setAuthorized(true);
    setLoading(false);
  }, [router]);

  // Loading state
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

  // Unauthorized state
  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-black mb-2">Unauthorized</h2>
          <p className="text-black/60 mb-6">You don't have permission to access this page</p>
          <button
            onClick={() => router.push('/admin/products')}
            className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-white via-white to-black/5 min-h-screen overflow-auto">
      <DashboardHeader />
      
      <main className="p-4 md:p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-6 md:mb-8">
          {/* Back Button */}
          <button
            onClick={() => router.push('/admin/products')}
            className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black mb-4 group transition-colors"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to Products
          </button>

          {/* Header Content */}
          <div className="bg-white rounded-2xl shadow-lg border border-black/5 p-6 md:p-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              {/* Title Section */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white text-xl">
                    ➕
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black">
                      Add New Product
                    </h1>
                    <p className="text-sm md:text-base text-black/50 mt-1">
                      Create a new anime gift product for your store
                    </p>
                  </div>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
                  <div className="bg-gradient-to-br from-black/5 to-black/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">💰</span>
                      <span className="text-xs text-black/60 uppercase tracking-wider">Currency</span>
                    </div>
                    <p className="text-lg font-bold text-black">Indian Rupee (₹)</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">📦</span>
                      <span className="text-xs text-blue-700/70 uppercase tracking-wider">Category</span>
                    </div>
                    <p className="text-lg font-bold text-blue-700">Anime Gifts</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">✨</span>
                      <span className="text-xs text-green-700/70 uppercase tracking-wider">Status</span>
                    </div>
                    <p className="text-lg font-bold text-green-700">Draft</p>
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="lg:w-80 bg-black/5 rounded-xl p-5 border border-black/10">
                <h3 className="font-bold text-black mb-3 flex items-center gap-2">
                  <span>💡</span>
                  Quick Tips
                </h3>
                <ul className="space-y-2 text-sm text-black/70">
                  <li className="flex items-start gap-2">
                    <span className="text-black/40 mt-0.5">•</span>
                    <span>Use high-quality images (minimum 800x800px)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black/40 mt-0.5">•</span>
                    <span>Write detailed descriptions for better SEO</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black/40 mt-0.5">•</span>
                    <span>Set competitive prices in ₹ INR</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black/40 mt-0.5">•</span>
                    <span>Add relevant tags for better discoverability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-black/40 mt-0.5">•</span>
                    <span>Save as draft first, then publish when ready</span>
                  </li>
                </ul>

                {/* Action Buttons */}
                <div className="mt-4 pt-4 border-t border-black/10">
                  <button
                    onClick={() => router.push('/admin/products')}
                    className="w-full px-4 py-2 bg-black/5 text-black rounded-lg text-sm font-medium hover:bg-black/10 transition-all"
                  >
                    View All Products
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-6">
          <div className="bg-white rounded-xl shadow-lg border border-black/5 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-black">Setup Progress</span>
              <span className="text-xs text-black/40">Fill in all required fields</span>
            </div>
            <div className="h-2 bg-black/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-black to-black/70 rounded-full transition-all duration-500"
                style={{ width: '0%' }}
              />
            </div>
          </div>
        </div>

        {/* Add Product Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-black/5 overflow-hidden">
          <AddProductForm />
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white flex-shrink-0 text-xl">
              ℹ️
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-blue-900 mb-2">Need Help?</h3>
              <p className="text-sm text-blue-800 mb-3">
                Having trouble adding a product? Check out our documentation or contact support.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => window.open('/admin/help', '_blank')}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-all"
                >
                  View Documentation
                </button>
                <button
                  onClick={() => window.open('/admin/support', '_blank')}
                  className="px-4 py-2 bg-white text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-50 transition-all border border-blue-200"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}