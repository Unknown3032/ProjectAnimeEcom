'use client';

import { useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { gsap } from 'gsap';

const OrdersAnalytics = () => {
  const containerRef = useRef(null);

  const statusData = [
    { name: 'Delivered', value: 2651, color: '#000000' },
    { name: 'Shipped', value: 156, color: '#333333' },
    { name: 'Processing', value: 89, color: '#666666' },
    { name: 'Pending', value: 124, color: '#999999' },
    { name: 'Cancelled', value: 72, color: '#CCCCCC' },
  ];

  const topProducts = [
    { name: 'Naruto Figure Set', orders: 234, percentage: 18 },
    { name: 'Attack on Titan Poster', orders: 189, percentage: 15 },
    { name: 'Demon Slayer Keychain', orders: 156, percentage: 12 },
    { name: 'One Piece Mug', orders: 142, percentage: 11 },
    { name: 'My Hero Academia Shirt', orders: 128, percentage: 10 },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        opacity: 0,
        x: 30,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.2,
      });

      gsap.from(containerRef.current.querySelectorAll('.stat-item'), {
        opacity: 0,
        x: -20,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.4,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black border border-white/20 px-4 py-2 rounded-lg shadow-xl">
          <p className="text-white text-sm font-medium">{payload[0].name}</p>
          <p className="text-white/80 text-xs">
            {payload[0].value} orders ({((payload[0].value / 3192) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Order Status Distribution */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-black/5">
        <h3 className="text-lg font-bold text-black mb-4">Order Status</h3>
        
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                animationDuration={1000}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 space-y-2">
          {statusData.map((status, index) => (
            <div key={index} className="stat-item flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: status.color }}
                />
                <span className="text-black/70">{status.name}</span>
              </div>
              <span className="font-semibold text-black">{status.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Products by Orders */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-black/5">
        <h3 className="text-lg font-bold text-black mb-4">Top Products</h3>
        
        <div className="space-y-3">
          {topProducts.map((product, index) => (
            <div key={index} className="stat-item">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-black/40">#{index + 1}</span>
                  <span className="text-xs font-medium text-black truncate max-w-[150px]">
                    {product.name}
                  </span>
                </div>
                <span className="text-xs font-semibold text-black">{product.orders}</span>
              </div>
              
              <div className="h-1.5 bg-black/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-black rounded-full transition-all duration-1000"
                  style={{ 
                    width: `${product.percentage * 5}%`,
                    transitionDelay: `${index * 100}ms`
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 text-xs font-medium text-black/60 hover:text-black transition-colors py-2 hover:underline">
          View All Products →
        </button>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-black/5">
        <h3 className="text-lg font-bold text-black mb-4">Quick Actions</h3>
        
        <div className="space-y-2">
          <button className="w-full px-4 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-black/90 transition-all duration-300 hover:shadow-md group">
            <span className="flex items-center justify-between">
              Process Pending Orders
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </button>
          
          <button className="w-full px-4 py-3 bg-black/5 text-black rounded-xl text-sm font-medium hover:bg-black/10 transition-all duration-300 group">
            <span className="flex items-center justify-between">
              Update Shipments
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </button>
          
          <button className="w-full px-4 py-3 bg-black/5 text-black rounded-xl text-sm font-medium hover:bg-black/10 transition-all duration-300 group">
            <span className="flex items-center justify-between">
              Handle Cancellations
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrdersAnalytics;