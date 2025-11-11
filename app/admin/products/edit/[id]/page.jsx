'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { isAuthenticated, isAdmin } from '@/lib/adminAuth.js';
import DashboardHeader from '../../../../../Components/admin/DashboardHeader';
import AddProductForm from '../../../../../Components/admin/AddProductForm';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/signin');
      return;
    }

    if (!isAdmin()) {
      router.replace('/');
      return;
    }

    // Fetch product data
    // In real app, this would be an API call
    const fetchProduct = async () => {
      // Simulated product data
      const productData = {
        id: params.id,
        name: 'Naruto Uzumaki Figure',
        sku: 'NAR-FIG-001',
        category: 'figures',
        subcategory: 'Action Figures',
        description: 'Premium collectible figure with detailed craftsmanship',
        price: '89.99',
        compareAtPrice: '119.99',
        costPerItem: '45.00',
        trackQuantity: true,
        quantity: '45',
        lowStockThreshold: '10',
        allowBackorder: false,
        weight: '0.5',
        length: '15',
        width: '10',
        height: '20',
        tags: ['naruto', 'anime', 'collectible', 'figure'],
        status: 'active',
        featured: true,
        images: [],
      };

      setProduct(productData);
      setAuthorized(true);
      setLoading(false);
    };

    fetchProduct();
  }, [router, params.id]);

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
              Edit Product
            </h1>
            <p className="text-sm md:text-base text-black/50">
              Update product information for {product?.name}
            </p>
          </div>
        </div>

        {/* Edit Product Form */}
        <AddProductForm initialData={product} isEdit={true} />
      </main>
    </div>
  );
}