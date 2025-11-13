'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { isAuthenticated, isAdmin } from '@/lib/adminAuth.js';
import DashboardHeader from '@/Components/admin/DashboardHeader';
import AddProductForm from '@/Components/admin/AddProductForm';
import toast from 'react-hot-toast';

function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  // Debug: Log the params
  useEffect(() => {
  }, [params]);

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
    
    // Check if params.id exists
    if (!params.id) {
      console.error('No ID in params!');
      setError('No product ID provided');
      setLoading(false);
      return;
    }

    // Handle if ID is an array (sometimes Next.js does this)
    const productId = Array.isArray(params.id) ? params.id[0] : params.id;

    if (productId) {
      fetchProduct(productId);
    } else {
      setError('Invalid product ID');
      setLoading(false);
    }
  }, [params, router]);

  const fetchProduct = async (productId) => {
    if (!productId || productId === 'undefined' || productId === 'null') {
      console.error('Invalid product ID:', productId);
      setError('Invalid product ID');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const url = `/api/admin/products/${productId}`;

      const response = await fetch(url);
      

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          setError('Product not found');
          toast.error('Product not found');
          setTimeout(() => router.push('/admin/products'), 2000);
          return;
        }
        
        if (response.status === 400) {
          setError(data.error || 'Invalid product ID');
          toast.error(data.error || 'Invalid product ID');
          return;
        }
        
        setError(data.error || 'Failed to fetch product');
        toast.error(data.error || 'Failed to fetch product');
        return;
      }

      if (!data.success || !data.product) {
        setError('Invalid product data received');
        toast.error('Invalid product data received');
        return;
      }

      // Transform backend data to match form structure
      const transformedProduct = {
        _id: data.product._id,
        
        // Basic Information
        name: data.product.name || '',
        sku: data.product.sku || '',
        category: data.product.category || '',
        subCategory: data.product.subCategory || '',
        description: data.product.description || '',
        shortDescription: data.product.shortDescription || '',

        // Anime Specific
        anime: {
          name: data.product.anime?.name || '',
          character: data.product.anime?.character || '',
          series: data.product.anime?.series || '',
          season: data.product.anime?.season || '',
          episode: data.product.anime?.episode || '',
        },

        // Pricing
        price: data.product.price?.toString() || '',
        originalPrice: data.product.originalPrice?.toString() || '',
        discount: data.product.discount || 0,
        currency: data.product.currency || 'USD',

        // Inventory
        stock: data.product.stock?.toString() || '0',
        trackQuantity: true,
        lowStockThreshold: '10',
        allowBackorder: false,

        // Shipping
        shipping: {
          weight: data.product.shipping?.weight?.toString() || '',
          dimensions: {
            length: data.product.shipping?.dimensions?.length?.toString() || '',
            width: data.product.shipping?.dimensions?.width?.toString() || '',
            height: data.product.shipping?.dimensions?.height?.toString() || '',
          },
          freeShipping: data.product.shipping?.freeShipping || false,
          estimatedDelivery: data.product.shipping?.estimatedDelivery || '',
        },

        // Brand & Licensing
        brand: data.product.brand || '',
        manufacturer: data.product.manufacturer || '',
        isOfficial: data.product.isOfficial || false,
        licensedBy: data.product.licensedBy || '',

        // Organization
        tags: data.product.tags || [],
        status: data.product.status || 'draft',
        isFeatured: data.product.isFeatured || false,
        isNewArrival: data.product.isNewArrival || false,
        isBestseller: data.product.isBestseller || false,

        // Age Rating
        ageRating: data.product.ageRating || 'All Ages',

        // Images - ensure proper format
        images: Array.isArray(data.product.images) 
          ? data.product.images.map((img, index) => {
              if (typeof img === 'string') {
                return { url: img, alt: data.product.name, isPrimary: index === 0 };
              }
              if (img.url) {
                return { ...img, isPrimary: img.isPrimary || index === 0 };
              }
              return null;
            }).filter(Boolean)
          : [],

        // Specifications
        specifications: {
          material: data.product.specifications?.material || '',
          weight: data.product.specifications?.weight || '',
          dimensions: {
            length: data.product.specifications?.dimensions?.length?.toString() || '',
            width: data.product.specifications?.dimensions?.width?.toString() || '',
            height: data.product.specifications?.dimensions?.height?.toString() || '',
            unit: data.product.specifications?.dimensions?.unit || 'cm',
          },
          careInstructions: data.product.specifications?.careInstructions || [],
          features: data.product.specifications?.features || [],
        },

        // Availability
        isAvailable: data.product.isAvailable ?? true,
        isPreOrder: data.product.isPreOrder || false,
        preOrderReleaseDate: data.product.preOrderReleaseDate || '',
        isLimitedEdition: data.product.isLimitedEdition || false,
        limitedQuantity: data.product.limitedQuantity?.toString() || '',
      };

      setProduct(transformedProduct);
      toast.success('Product loaded successfully');
      
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(error.message || 'Failed to load product');
      toast.error(error.message || 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async () => {
    const productId = Array.isArray(params.id) ? params.id[0] : params.id;
    if (!productId) return;

    const loadingToast = toast.loading('Deleting product...');
    
    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete product');
      }

      toast.dismiss(loadingToast);
      toast.success('Product deleted successfully');
      
      setTimeout(() => {
        router.push('/admin/products');
      }, 1000);
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.dismiss(loadingToast);
      toast.error(error.message || 'Failed to delete product');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-black/40 tracking-wider uppercase">Loading product...</p>
          {params.id && (
            <p className="text-xs text-black/20 mt-2">ID: {Array.isArray(params.id) ? params.id[0] : params.id}</p>
          )}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-black mb-2">Error Loading Product</h2>
          <p className="text-black/60 mb-2">{error}</p>
          <p className="text-xs text-black/40 mb-6">
            ID: {Array.isArray(params.id) ? params.id[0] : params.id || 'No ID'}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push('/admin/products')}
              className="px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all"
            >
              Back to Products
            </button>
            <button
              onClick={() => {
                const productId = Array.isArray(params.id) ? params.id[0] : params.id;
                if (productId) fetchProduct(productId);
              }}
              className="px-6 py-3 bg-black/5 text-black rounded-xl font-medium hover:bg-black/10 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not authorized
  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-black mb-2">Unauthorized</h2>
          <p className="text-black/60">You don't have permission to access this page</p>
        </div>
      </div>
    );
  }

  // No product loaded
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-2xl font-bold text-black mb-2">Product Not Found</h2>
          <p className="text-black/60 mb-6">The product you're looking for doesn't exist</p>
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
          <div>
            <button
              onClick={() => router.push('/admin/products')}
              className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black mb-3 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              Back to Products
            </button>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-2">
              Edit Product
            </h1>
            <p className="text-sm md:text-base text-black/50">
              Update product information for {product.name}
            </p>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="px-3 py-1 bg-black/10 rounded-full text-xs font-medium text-black">
                SKU: {product.sku}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                product.status === 'published' 
                  ? 'bg-green-100 text-green-700'
                  : product.status === 'draft'
                  ? 'bg-yellow-100 text-yellow-700'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {product.status?.charAt(0).toUpperCase() + product.status?.slice(1)}
              </span>
              {product.isFeatured && (
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                  ⭐ Featured
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => window.open(`/product/${product._id}`, '_blank')}
              className="px-4 py-2 bg-black/5 text-black rounded-xl font-medium hover:bg-black/10 transition-all inline-flex items-center gap-2"
              title="Preview product"
            >
              <span>👁️</span>
              <span className="hidden sm:inline">Preview</span>
            </button>
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
                  deleteProduct();
                }
              }}
              className="px-4 py-2 bg-red-500/10 text-red-600 rounded-xl font-medium hover:bg-red-500/20 transition-all inline-flex items-center gap-2"
              title="Delete product"
            >
              <span>🗑️</span>
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>

        {/* Edit Product Form */}
        <AddProductForm initialData={product} isEdit={true} />
      </main>
    </div>
  );
}

export default EditProductPage;