'use client';

import { useEffect, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { gsap } from 'gsap';

const ProductsAnalytics = () => {
  const containerRef = useRef(null);

  const categoryData = [
    { category: 'Figures', products: 89, revenue: 15680 },
    { category: 'Posters', products: 124, revenue: 8920 },
    { category: 'Keychains', products: 67, revenue: 4560 },
    { category: 'Clothing', products: 45, revenue: 6780 },
    { category: 'Accessories', products: 52, revenue: 5240 },
  ];

  const topProducts = [
    { name: 'Naruto Figure', sales: 234, trend: 'up' },
    { name: 'AOT Poster', sales: 189, trend: 'up' },
    { name: 'DS Keychain', sales: 156, trend: 'down' },
    { name: 'OP Mug', sales: 142, trend: 'up' },
  ];

  useEffect(() => {
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
  }, []);

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

  return (
    <div ref={containerRef} className="grid lg:grid-cols-3 gap-6">
      {/* Category Performance Chart */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-black/5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-black">Category Performance</h3>
            <p className="text-sm text-black/50 mt-1">Revenue by product category</p>
          </div>
        </div>

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
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#00000010' }} />
              <Bar 
                dataKey="revenue" 
                fill="#000000"
                radius={[8, 8, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-black/5">
        <h3 className="text-xl font-bold text-black mb-6">Top Products</h3>
        
        <div className="space-y-4">
          {topProducts.map((product, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-black truncate">{product.name}</p>
                <p className="text-xs text-black/50">{product.sales} sales</p>
              </div>
              
              <div className={`text-lg ${product.trend === 'up' ? 'text-black' : 'text-black/30'}`}>
                {product.trend === 'up' ? '↑' : '↓'}
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all">
          View All Products
        </button>
      </div>
    </div>
  );
};

export default ProductsAnalytics;