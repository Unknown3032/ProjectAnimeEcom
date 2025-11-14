'use client';

import { useRef, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { gsap } from 'gsap';

export default function RevenueByCategory({ data }) {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 1.2 }
    );
  }, []);

  const COLORS = ['#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080', '#999999'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black text-white px-4 py-3 rounded-lg shadow-2xl border border-white/20">
          <p className="text-sm font-medium mb-1">{payload[0].payload.category}</p>
          <p className="text-xs">Revenue: ${payload[0].value.toLocaleString()}</p>
          <p className="text-xs">Orders: {payload[0].payload.orders}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div ref={containerRef} className="bg-white border border-black/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black mb-1">Revenue by Category</h2>
        <p className="text-xs text-black/50">Last 30 days performance breakdown</p>
      </div>

      {!data || data.length === 0 ? (
        <div className="h-[300px] flex items-center justify-center text-black/40">
          No category data available
        </div>
      ) : (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#000000" strokeOpacity={0.05} />
              <XAxis 
                dataKey="category" 
                stroke="#000000"
                strokeOpacity={0.3}
                tick={{ fill: '#000000', opacity: 0.5, fontSize: 10 }}
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
                tickFormatter={(value) => `$${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#00000005' }} />
              <Bar dataKey="revenue" radius={[8, 8, 0, 0]} animationDuration={800}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Summary Stats */}
      {data && data.length > 0 && (
        <div className="mt-6 pt-6 border-t border-black/5">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-black/40 mb-1">Categories</p>
              <p className="text-lg font-bold">{data.length}</p>
            </div>
            <div>
              <p className="text-xs text-black/40 mb-1">Total Revenue</p>
              <p className="text-lg font-bold">
                ${data.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-black/40 mb-1">Total Orders</p>
              <p className="text-lg font-bold">
                {data.reduce((sum, item) => sum + item.orders, 0)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}