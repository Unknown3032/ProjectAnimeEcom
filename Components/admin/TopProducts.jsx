'use client';

import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

export default function TopProducts({ initialProducts }) {
  const containerRef = useRef(null);
  const [products, setProducts] = useState(initialProducts || []);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('30d');
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    if (initialProducts) {
      setProducts(initialProducts);
    }
  }, [initialProducts]);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 1 }
    );
  }, [products]);

  useEffect(() => {
    if (!initialProducts) {
      loadTopProducts();
    }
  }, []);

  const loadTopProducts = async () => {
    setLoading(true);
    try {
      // Get user ID from localStorage
      const userStr = localStorage.getItem('user');
      let userId = null;
      
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          userId = user._id;
        } catch (e) {
          console.error('Failed to parse user:', e);
        }
      }

      if (!userId) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(
        `/api/admin/products/analytics/top-products?limit=${limit}&period=${period}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userId}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch top products');
      }

      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load top products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = async (newPeriod) => {
    setPeriod(newPeriod);
    setLoading(true);
    try {
      const userStr = localStorage.getItem('user');
      let userId = null;
      
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          userId = user._id;
        } catch (e) {
          console.error('Failed to parse user:', e);
        }
      }

      const response = await fetch(
        `/api/admin/products/analytics/top-products?limit=${limit}&period=${newPeriod}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userId}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch top products');
      }

      const data = await response.json();
      
      if (data.success) {
        setProducts(data.data || []);
      }
    } catch (error) {
      console.error('Failed to load top products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format currency to INR
  const formatINR = (value) => {
    const numValue = typeof value === 'string' 
      ? parseFloat(value.replace(/[^0-9.-]+/g, ''))
      : value;
    
    return `₹${numValue.toLocaleString('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  };

  // Format compact INR
  const formatCompactINR = (value) => {
    const numValue = typeof value === 'string' 
      ? parseFloat(value.replace(/[^0-9.-]+/g, ''))
      : value;

    if (numValue >= 10000000) return `₹${(numValue / 10000000).toFixed(1)}Cr`;
    if (numValue >= 100000) return `₹${(numValue / 100000).toFixed(1)}L`;
    if (numValue >= 1000) return `₹${(numValue / 1000).toFixed(1)}K`;
    return formatINR(numValue);
  };

  const periods = [
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' },
    { value: '90d', label: '90D' },
  ];

  const calculateTotalRevenue = () => {
    return products.reduce((sum, product) => {
      const revenue = typeof product.revenue === 'string' 
        ? parseFloat(product.revenue.replace(/[^0-9.-]+/g, ''))
        : product.revenue;
      return sum + (revenue || 0);
    }, 0);
  };

  const calculateTotalSales = () => {
    return products.reduce((sum, product) => sum + (product.sales || 0), 0);
  };

  return (
    <div ref={containerRef} className="bg-white border border-black/10 rounded-2xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="p-6 border-b border-black/10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Top Products</h2>
            <p className="text-xs text-black/40 mt-1">
              Best selling items • {calculateTotalSales()} total sales
            </p>
          </div>

          {/* Period Selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-black/5 rounded-lg p-1">
              {periods.map((p) => (
                <button
                  key={p.value}
                  onClick={() => handlePeriodChange(p.value)}
                  disabled={loading}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 disabled:opacity-50 ${
                    period === p.value
                      ? 'bg-black text-white shadow-md'
                      : 'text-black/60 hover:text-black'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        {products.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-black/5 to-black/10 rounded-lg p-3">
              <p className="text-xs text-black/50 mb-1">Total Revenue</p>
              <p className="text-lg font-bold">{formatCompactINR(calculateTotalRevenue())}</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3">
              <p className="text-xs text-green-700/70 mb-1">Products</p>
              <p className="text-lg font-bold text-green-700">{products.length}</p>
            </div>
          </div>
        )}
      </div>

      {/* Products List */}
      <div className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex flex-col items-center justify-center text-black/40">
              <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-sm font-medium">No products data available</p>
              <p className="text-xs mt-1">Top products will appear here once you have sales</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((product, index) => (
              <div 
                key={product.id || product._id || index} 
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-black/[0.02] transition-all group border border-transparent hover:border-black/10"
                style={{
                  animation: `slideIn 0.3s ease-out ${index * 0.1}s both`
                }}
              >
                {/* Rank Badge */}
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-black/5 text-black/40'
                  }`}>
                    #{index + 1}
                  </div>
                </div>

                {/* Product Image */}
                <div className="flex-shrink-0 w-16 h-16 bg-gray-100 overflow-hidden rounded-lg border border-black/5">
                  <img 
                    src={product.image || product.images?.[0] || '/placeholder-product.jpg'} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = '/placeholder-product.jpg';
                    }}
                  />
                </div>

                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold mb-1 truncate group-hover:text-black/70 transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                    {/* Sales */}
                    <div className="flex items-center gap-1 text-black/60">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <span className="font-medium">{product.sales || product.totalSales || 0}</span> sales
                    </div>

                    <span className="text-black/20">•</span>

                    {/* Revenue */}
                    <div className="flex items-center gap-1 font-semibold text-black">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatCompactINR(product.revenue || product.totalRevenue || 0)}
                    </div>
                  </div>

                  {/* Category & Stock */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-black/40 mt-1">
                    {product.category && (
                      <>
                        <span className="capitalize">{product.category}</span>
                        <span>•</span>
                      </>
                    )}
                    
                    {product.stock !== undefined && (
                      <span className={`font-medium ${
                        product.stock === 0 ? 'text-red-600' :
                        product.stock < 10 ? 'text-orange-600' : 
                        'text-green-600'
                      }`}>
                        {product.stock === 0 ? 'Out of stock' :
                         product.stock < 10 ? `Low stock: ${product.stock}` :
                         `${product.stock} in stock`}
                      </span>
                    )}
                  </div>
                </div>

                {/* Performance Indicator */}
                <div className="flex-shrink-0 hidden sm:block">
                  <div className="text-right">
                    <div className="text-xs text-black/40 mb-1">Performance</div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div 
                          key={i}
                          className={`w-1 h-6 rounded-full transition-all ${
                            i < Math.min(5, Math.ceil((5 - index) * 1.2))
                              ? 'bg-black'
                              : 'bg-black/10'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-black/10 bg-black/[0.01] flex items-center justify-between">
        <div className="text-xs text-black/40">
          Currency: Indian Rupee (₹)
        </div>
        <button className="text-sm font-medium hover:underline inline-flex items-center gap-1 group">
          View all products 
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}