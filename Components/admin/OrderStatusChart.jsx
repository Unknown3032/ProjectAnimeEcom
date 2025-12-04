'use client';

import { useRef, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { gsap } from 'gsap';

export default function OrderStatusChart({ data }) {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 1.4 }
    );
  }, []);

  // Format currency to INR
  const formatINR = (value) => {
    return `₹${value.toLocaleString('en-IN')}`;
  };

  // Format large numbers
  const formatCompactINR = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
  };

  const COLORS = {
    delivered: '#000000',
    shipped: '#1a1a1a',
    processing: '#4d4d4d',
    pending: '#999999',
    cancelled: '#cccccc'
  };

  const STATUS_LABELS = {
    delivered: 'Delivered',
    shipped: 'Shipped',
    processing: 'Processing',
    pending: 'Pending',
    cancelled: 'Cancelled'
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-black text-white px-4 py-3 rounded-lg shadow-2xl border border-white/20">
          <p className="text-sm font-medium mb-2 capitalize">{STATUS_LABELS[data.status] || data.status}</p>
          <div className="space-y-1">
            <p className="text-xs">Orders: <span className="font-semibold">{data.count}</span></p>
            <p className="text-xs">Revenue: <span className="font-semibold">{formatINR(data.revenue)}</span></p>
            <p className="text-xs">
              Percentage: <span className="font-semibold">{((data.count / data.totalCount) * 100).toFixed(1)}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Add total count for percentage calculation
  const totalOrders = data?.reduce((sum, item) => sum + item.count, 0) || 0;
  const totalRevenue = data?.reduce((sum, item) => sum + item.revenue, 0) || 0;
  const enrichedData = data?.map(item => ({
    ...item,
    totalCount: totalOrders
  })) || [];

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent > 0.05 ? (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <div ref={containerRef} className="bg-white border border-black/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black mb-1">Order Status Distribution</h2>
        <p className="text-xs text-black/50">Current order breakdown by status</p>
      </div>

      {!data || data.length === 0 ? (
        <div className="h-[300px] flex flex-col items-center justify-center text-black/40">
          <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm">No order status data available</p>
          <p className="text-xs mt-1">Orders will appear here once created</p>
        </div>
      ) : (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={enrichedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
                nameKey="status"
                animationDuration={800}
              >
                {enrichedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.status] || '#666666'} 
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => (
                  <span className="capitalize text-sm">
                    {STATUS_LABELS[value] || value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Status Summary */}
      {data && data.length > 0 && (
        <div className="mt-6 pt-6 border-t border-black/5">
          {/* Total Summary */}
          <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-black/5 rounded-lg">
            <div>
              <p className="text-xs text-black/50 mb-1">Total Orders</p>
              <p className="text-lg font-bold">{totalOrders.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-xs text-black/50 mb-1">Total Revenue</p>
              <p className="text-lg font-bold">{formatCompactINR(totalRevenue)}</p>
            </div>
          </div>

          {/* Individual Status Breakdown */}
          <div className="space-y-2">
            {data
              .sort((a, b) => b.count - a.count) // Sort by count descending
              .map((item) => (
                <div key={item.status} className="flex items-center justify-between hover:bg-black/5 p-2 rounded-lg transition-colors">
                  <div className="flex items-center gap-3 flex-1">
                    <div 
                      className="w-3 h-3 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: COLORS[item.status] || '#666666' }}
                    />
                    <span className="text-sm capitalize font-medium">
                      {STATUS_LABELS[item.status] || item.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">
                      {item.count} {item.count === 1 ? 'order' : 'orders'}
                    </div>
                    <div className="text-xs text-black/60">
                      {formatCompactINR(item.revenue)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Currency Info */}
      {data && data.length > 0 && (
        <div className="mt-4 pt-4 border-t border-black/5">
          <div className="flex items-center justify-between text-xs text-black/40">
            <span>Currency: Indian Rupee (₹)</span>
            <span>Updated in real-time</span>
          </div>
        </div>
      )}
    </div>
  );
}