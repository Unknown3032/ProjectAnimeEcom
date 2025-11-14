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
          <p className="text-sm font-medium mb-1 capitalize">{STATUS_LABELS[data.status] || data.status}</p>
          <p className="text-xs">Orders: {data.count}</p>
          <p className="text-xs">Revenue: ${data.revenue.toLocaleString()}</p>
          <p className="text-xs">
            Percentage: {((data.count / data.totalCount) * 100).toFixed(1)}%
          </p>
        </div>
      );
    }
    return null;
  };

  // Add total count for percentage calculation
  const totalOrders = data?.reduce((sum, item) => sum + item.count, 0) || 0;
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
        <div className="h-[300px] flex items-center justify-center text-black/40">
          No order status data available
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
          <div className="space-y-2">
            {data.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[item.status] || '#666666' }}
                  />
                  <span className="text-sm capitalize">
                    {STATUS_LABELS[item.status] || item.status}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">{item.count} orders</span>
                  <span className="text-xs text-black/40 ml-2">
                    ${item.revenue.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}