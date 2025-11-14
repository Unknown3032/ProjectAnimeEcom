'use client';

import { useRef, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { gsap } from 'gsap';

export default function AvgOrderTrend({ data }) {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 1.8 }
    );
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black text-white px-4 py-3 rounded-lg shadow-2xl border border-white/20">
          <p className="text-sm font-medium mb-1">{payload[0].payload.date}</p>
          <p className="text-xs">Avg Order: ${payload[0].value.toLocaleString()}</p>
          <p className="text-xs">Orders: {payload[0].payload.orders}</p>
        </div>
      );
    }
    return null;
  };

  const avgValue = data && data.length > 0
    ? (data.reduce((sum, item) => sum + item.avgOrder, 0) / data.length).toFixed(2)
    : 0;

  const maxValue = data && data.length > 0
    ? Math.max(...data.map(item => item.avgOrder))
    : 0;

  const minValue = data && data.length > 0
    ? Math.min(...data.map(item => item.avgOrder))
    : 0;

  return (
    <div ref={containerRef} className="bg-white border border-black/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black mb-1">Average Order Value Trend</h2>
        <p className="text-xs text-black/50">Daily average order value over the last 30 days</p>
      </div>

      {!data || data.length === 0 ? (
        <div className="h-[250px] flex items-center justify-center text-black/40">
          No average order data available
        </div>
      ) : (
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#000000" strokeOpacity={0.05} />
              <XAxis 
                dataKey="date" 
                stroke="#000000"
                strokeOpacity={0.3}
                tick={{ fill: '#000000', opacity: 0.5, fontSize: 10 }}
                tickLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                stroke="#000000"
                strokeOpacity={0.3}
                tick={{ fill: '#000000', opacity: 0.5, fontSize: 11 }}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#000000', strokeOpacity: 0.1 }} />
              <Line 
                type="monotone" 
                dataKey="avgOrder" 
                stroke="#000000" 
                strokeWidth={2.5}
                dot={{ fill: '#000000', r: 3, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 5, fill: '#000000', strokeWidth: 2, stroke: '#fff' }}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Trend Summary */}
      {data && data.length > 0 && (
        <div className="mt-6 pt-6 border-t border-black/5">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-black/40 mb-1">Average</p>
              <p className="text-lg font-bold">${avgValue}</p>
            </div>
            <div>
              <p className="text-xs text-black/40 mb-1">Highest</p>
              <p className="text-lg font-bold text-green-600">${maxValue.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-black/40 mb-1">Lowest</p>
              <p className="text-lg font-bold text-red-600">${minValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}