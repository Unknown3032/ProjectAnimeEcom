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
      const [categoryResponse, topProductsResponse] = await Promise.all([
        fetch('/api/admin/products/analytics/categories'),
        fetch('/api/admin/products/analytics/top-products'),
      ]);

      if (categoryResponse.ok) {
        const categoryData = await categoryResponse.json();
        if (categoryData.success) {
          setCategoryData(categoryData.data);
        }
      }

      if (topProductsResponse.ok) {
        const topProductsData = await topProductsResponse.json();
        if (topProductsData.success) {
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

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black border border-white/20 px-4 py-3 rounded-xl shadow-2xl">
          <p className="text-white text-sm font-medium mb-2">{payload[0].payload.category}</p>
          <div className="space-y-1">
            <p className="text-white/90 text-xs">
              Products: <span className="font-semibold">{payload[0].payload.products}</span>
            </p>
            <p className="text-white/90 text-xs">
              Revenue: <span className="font-semibold">${payload[0].payload.revenue.toLocaleString()}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

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
            className="px-3 py-2 bg-black/5 rounded-lg text-xs font-medium text-black hover:bg-black/10 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        {categoryData.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000000" strokeOpacity={0.05} />
                <XAxis
                  dataKey="category"
                  stroke="#000000"
                  strokeOpacity={0.3}
                  tick={{ fill: '#000000', opacity: 0.5, fontSize: 11 }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#000000"
                  strokeOpacity={0.3}
                  tick={{ fill: '#000000', opacity: 0.5, fontSize: 11 }}
                  tickLine={false}
                  tickFormatter={(value) => `$${value >= 1000 ? (value / 1000).toFixed(1) + 'k' : value}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#00000010' }} />
                <Bar dataKey="revenue" fill="#000000" radius={[8, 8, 0, 0]} animationDuration={1000} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-black/40">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <p className="text-sm">No category data available</p>
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
                  key={product._id}
                  href={`/admin/products/edit/${product._id}`}
                  className="flex items-center gap-3 hover:bg-black/5 p-2 rounded-lg transition-colors group"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate group-hover:underline">
                      {product.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-black/50">{product.purchases || 0} sales</p>
                      <span className="text-xs text-black/30">•</span>
                      <p className="text-xs text-black/50">${product.price}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {product.rating?.average > 0 && (
                      <div className="flex items-center gap-1 text-xs text-black/60">
                        <span>⭐</span>
                        <span>{product.rating.average.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <Link
              href="/admin/products"
              className="w-full mt-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all block text-center"
            >
              View All Products
            </Link>
          </>
        ) : (
          <div className="py-12 text-center text-black/40">
            <div className="text-4xl mb-2">📦</div>
            <p className="text-sm">No top products yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsAnalytics;