'use client';

import { useEffect, useRef, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { gsap } from 'gsap';
import Link from 'next/link';

const ProductsAnalytics = () => {
  const containerRef = useRef(null);
  const [categoryData, setCategoryData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    // Refresh analytics every 60 seconds
    const interval = setInterval(fetchAnalytics, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnalytics = async () => {
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

      const headers = {
        'Content-Type': 'application/json',
      };

      if (userId) {
        headers['Authorization'] = `Bearer ${userId}`;
      }

      const [categoryResponse, topProductsResponse] = await Promise.all([
        fetch('/api/admin/products/analytics/categories', { headers }),
        fetch('/api/admin/products/analytics/top-products', { headers }),
      ]);

      if (categoryResponse.ok) {
        const categoryData = await categoryResponse.json();
        console.log('Category Data:', categoryData); // Debug log
        if (categoryData.success && categoryData.data) {
          setCategoryData(categoryData.data);
        }
      }

      if (topProductsResponse.ok) {
        const topProductsData = await topProductsResponse.json();
        console.log('Top Products Data:', topProductsData); // Debug log
        if (topProductsData.success && topProductsData.data) {
          setTopProducts(topProductsData.data);
        }
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      const ctx = gsap.context(() => {
        gsap.from(containerRef.current.children, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          delay: 0.2,
        });
      }, containerRef);

      return () => ctx.revert();
    }
  }, [loading]);

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

  // Format large numbers for Y-axis
  const formatYAxis = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black border border-white/20 px-4 py-3 rounded-xl shadow-2xl">
          <p className="text-white text-sm font-medium mb-2">
            {data.category || data.name || 'Unknown'}
          </p>
          <div className="space-y-1">
            <p className="text-white/90 text-xs">
              Products: <span className="font-semibold">{data.products || data.productCount || 0}</span>
            </p>
            <p className="text-white/90 text-xs">
              Revenue: <span className="font-semibold">{formatINR(data.revenue || 0)}</span>
            </p>
            {data.totalSales && (
              <p className="text-white/90 text-xs">
                Sales: <span className="font-semibold">{data.totalSales}</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const COLORS = ['#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080', '#999999'];

  if (loading) {
    return (
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-black/5 animate-pulse">
          <div className="h-6 bg-black/10 rounded w-1/3 mb-2" />
          <div className="h-4 bg-black/10 rounded w-1/2 mb-6" />
          <div className="h-[300px] bg-black/5 rounded-xl" />
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-black/5 animate-pulse">
          <div className="h-6 bg-black/10 rounded w-1/2 mb-6" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-black/10 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-black/10 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-black/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="grid lg:grid-cols-3 gap-6">
      {/* Category Performance Chart */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-black/5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-black">Category Performance</h3>
            <p className="text-sm text-black/50 mt-1">Revenue by product category</p>
          </div>
          <button
            onClick={fetchAnalytics}
            className="px-4 py-2 bg-black text-white rounded-lg text-xs font-medium hover:bg-black/90 transition-all inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {categoryData.length > 0 ? (
          <>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#000000" strokeOpacity={0.05} />
                  <XAxis
                    dataKey={(data) => data.category || data.name || 'Unknown'}
                    stroke="#000000"
                    strokeOpacity={0.3}
                    tick={{ fill: '#000000', opacity: 0.5, fontSize: 11 }}
                    tickLine={false}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis
                    stroke="#000000"
                    strokeOpacity={0.3}
                    tick={{ fill: '#000000', opacity: 0.5, fontSize: 11 }}
                    tickLine={false}
                    tickFormatter={formatYAxis}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#00000010' }} />
                  <Bar dataKey="revenue" radius={[8, 8, 0, 0]} animationDuration={1000}>
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category Summary */}
            <div className="mt-6 pt-6 border-t border-black/5">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-black/5 rounded-lg p-3">
                  <p className="text-xs text-black/50 mb-1">Categories</p>
                  <p className="text-lg font-bold">{categoryData.length}</p>
                </div>
                <div className="bg-black/5 rounded-lg p-3">
                  <p className="text-xs text-black/50 mb-1">Total Revenue</p>
                  <p className="text-lg font-bold">
                    {formatINR(categoryData.reduce((sum, cat) => sum + (cat.revenue || 0), 0))}
                  </p>
                </div>
                <div className="bg-black/5 rounded-lg p-3">
                  <p className="text-xs text-black/50 mb-1">Total Products</p>
                  <p className="text-lg font-bold">
                    {categoryData.reduce((sum, cat) => sum + (cat.products || cat.productCount || 0), 0)}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-black/40">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-sm font-medium">No category data available</p>
              <p className="text-xs mt-1">Categories will appear here once products are added</p>
            </div>
          </div>
        )}
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-black/5">
        <h3 className="text-xl font-bold text-black mb-6">Top Products</h3>

        {topProducts.length > 0 ? (
          <>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <Link
                  key={product._id || product.id}
                  href={`/admin/products/edit/${product._id || product.id}`}
                  className="flex items-center gap-3 hover:bg-black/5 p-3 rounded-lg transition-all group border border-transparent hover:border-black/10"
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-black/10 text-black'
                  }`}>
                    #{index + 1}
                  </div>

                  {/* Product Image */}
                  {(product.image || product.images?.[0]) && (
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={product.image || product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        onError={(e) => {
                          e.target.src = '/placeholder-product.jpg';
                        }}
                      />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-black truncate group-hover:underline">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <p className="text-xs text-black/50">
                        {product.purchases || product.sales || product.totalSales || 0} sales
                      </p>
                      <span className="text-xs text-black/30">•</span>
                      <p className="text-xs font-medium text-black">
                        {formatINR(product.price || 0)}
                      </p>
                    </div>
                    {product.category && (
                      <p className="text-xs text-black/40 mt-1 capitalize">
                        {product.category}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {product.rating?.average > 0 && (
                      <div className="flex items-center gap-1 text-xs text-black/60 bg-yellow-50 px-2 py-1 rounded-full">
                        <span>⭐</span>
                        <span className="font-medium">{product.rating.average.toFixed(1)}</span>
                      </div>
                    )}
                    {product.revenue && (
                      <p className="text-xs text-green-600 font-medium">
                        {formatINR(product.revenue)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <Link
              href="/admin/products"
              className="w-full mt-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all block text-center group"
            >
              View All Products
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </>
        ) : (
          <div className="py-12 text-center text-black/40">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-sm font-medium">No top products yet</p>
            <p className="text-xs mt-1">Products will appear here once you have sales</p>
          </div>
        )}
      </div>

      {/* Custom Animation */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ProductsAnalytics;