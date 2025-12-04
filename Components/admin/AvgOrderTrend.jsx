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

  // Format currency to INR
  const formatINR = (value) => {
    return `₹${value.toLocaleString('en-IN')}`;
  };

  // Format large numbers for Y-axis
  const formatYAxis = (value) => {
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black text-white px-4 py-3 rounded-lg shadow-2xl border border-white/20">
          <p className="text-sm font-medium mb-2">{payload[0].payload.date}</p>
          <div className="space-y-1">
            <p className="text-xs">
              Avg Order: <span className="font-semibold">{formatINR(payload[0].value)}</span>
            </p>
            <p className="text-xs">
              Orders: <span className="font-semibold">{payload[0].payload.orders}</span>
            </p>
            {payload[0].payload.totalRevenue && (
              <p className="text-xs">
                Revenue: <span className="font-semibold">{formatINR(payload[0].payload.totalRevenue)}</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const avgValue = data && data.length > 0
    ? (data.reduce((sum, item) => sum + item.avgOrder, 0) / data.length)
    : 0;

  const maxValue = data && data.length > 0
    ? Math.max(...data.map(item => item.avgOrder))
    : 0;

  const minValue = data && data.length > 0
    ? Math.min(...data.map(item => item.avgOrder))
    : 0;

  // Calculate trend (percentage change from first to last)
  const trendPercentage = data && data.length > 1
    ? (((data[data.length - 1].avgOrder - data[0].avgOrder) / data[0].avgOrder) * 100)
    : 0;

  const totalOrders = data && data.length > 0
    ? data.reduce((sum, item) => sum + (item.orders || 0), 0)
    : 0;

  return (
    <div ref={containerRef} className="bg-white border border-black/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-black mb-1">Average Order Value Trend</h2>
          <p className="text-xs text-black/50">Daily average order value over the last 30 days</p>
        </div>
        
        {/* Trend Indicator */}
        {data && data.length > 1 && (
          <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
            trendPercentage >= 0 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            {trendPercentage >= 0 ? '↑' : '↓'} {Math.abs(trendPercentage).toFixed(1)}%
          </div>
        )}
      </div>

      {!data || data.length === 0 ? (
        <div className="h-[250px] flex flex-col items-center justify-center text-black/40">
          <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          <p className="text-sm">No average order data available</p>
          <p className="text-xs mt-1">Data will appear as orders are processed</p>
        </div>
      ) : (
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#000000" />
                  <stop offset="100%" stopColor="#4d4d4d" />
                </linearGradient>
              </defs>
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
                tickFormatter={formatYAxis}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#000000', strokeOpacity: 0.1 }} />
              <Line 
                type="monotone" 
                dataKey="avgOrder" 
                stroke="url(#lineGradient)"
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-black/5 to-black/10 rounded-xl p-3 hover:shadow-md transition-all group">
              <p className="text-xs text-black/50 mb-1">Average AOV</p>
              <p className="text-lg font-bold group-hover:scale-105 transition-transform">
                {formatINR(avgValue)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 hover:shadow-md transition-all group">
              <p className="text-xs text-green-700/70 mb-1">Highest</p>
              <p className="text-lg font-bold text-green-700 group-hover:scale-105 transition-transform">
                {formatINR(maxValue)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-3 hover:shadow-md transition-all group">
              <p className="text-xs text-red-700/70 mb-1">Lowest</p>
              <p className="text-lg font-bold text-red-700 group-hover:scale-105 transition-transform">
                {formatINR(minValue)}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3 hover:shadow-md transition-all group">
              <p className="text-xs text-blue-700/70 mb-1">Total Orders</p>
              <p className="text-lg font-bold text-blue-700 group-hover:scale-105 transition-transform">
                {totalOrders.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Additional Insights */}
          <div className="mt-4 p-3 bg-black/5 rounded-lg">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div>
                <span className="text-black/60">
                  AOV Range: {formatINR(minValue)} - {formatINR(maxValue)}
                </span>
              </div>
              <span className="text-black/40">
                Variance: {formatINR(maxValue - minValue)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Currency Info */}
      {data && data.length > 0 && (
        <div className="mt-4 pt-4 border-t border-black/5">
          <div className="flex items-center justify-between text-xs text-black/40">
            <span>Currency: Indian Rupee (₹)</span>
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${trendPercentage >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
              Trend: {trendPercentage >= 0 ? 'Increasing' : 'Decreasing'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}