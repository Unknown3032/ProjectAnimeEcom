'use client';

import { useRef, useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { gsap } from 'gsap';
import { adminAPI } from '@/lib/api/adminApi';

export default function RevenueByCategory({ initialData }) {
  const containerRef = useRef(null);
  const [data, setData] = useState(initialData || []);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 1.2 }
    );
  }, []);

  useEffect(() => {
    if (!initialData) {
      loadCategoryData();
    }
  }, []);

  const loadCategoryData = async () => {
    setLoading(true);
    try {
      const response = await adminAPI.getCategoryRevenue(period);
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Failed to load category data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePeriodChange = async (newPeriod) => {
    setPeriod(newPeriod);
    setLoading(true);
    try {
      const response = await adminAPI.getCategoryRevenue(newPeriod);
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Failed to load category data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format currency to INR
  const formatINR = (value) => {
    return `₹${value.toLocaleString('en-IN')}`;
  };

  // Format large numbers for Y-axis
  const formatYAxis = (value) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
    if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`;
    return `₹${value}`;
  };

  const COLORS = ['#000000', '#1a1a1a', '#333333', '#4d4d4d', '#666666', '#808080', '#999999'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black text-white px-4 py-3 rounded-lg shadow-2xl border border-white/20">
          <p className="text-sm font-medium mb-2">{payload[0].payload.category}</p>
          <div className="space-y-1">
            <p className="text-xs">Revenue: <span className="font-semibold">{formatINR(payload[0].value)}</span></p>
            <p className="text-xs">Orders: <span className="font-semibold">{payload[0].payload.orders}</span></p>
            {payload[0].payload.units && (
              <p className="text-xs">Units: <span className="font-semibold">{payload[0].payload.units}</span></p>
            )}
            {payload[0].payload.avgOrderValue && (
              <p className="text-xs">Avg Order: <span className="font-semibold">{formatINR(payload[0].payload.avgOrderValue)}</span></p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const periods = [
    { value: '7d', label: '7D' },
    { value: '30d', label: '30D' },
    { value: '90d', label: '90D' },
  ];

  return (
    <div ref={containerRef} className="bg-white border border-black/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-black mb-1">Revenue by Category</h2>
          <p className="text-xs text-black/50">Performance breakdown by product categories</p>
        </div>

        {/* Period Selector */}
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

      {loading ? (
        <div className="h-[300px] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
        </div>
      ) : !data || data.length === 0 ? (
        <div className="h-[300px] flex flex-col items-center justify-center text-black/40">
          <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <p className="text-sm">No category data available</p>
          <p className="text-xs mt-1">Orders will appear here once processed</p>
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
                tickFormatter={formatYAxis}
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
                {formatINR(data.reduce((sum, item) => sum + item.revenue, 0))}
              </p>
            </div>
            <div>
              <p className="text-xs text-black/40 mb-1">Total Orders</p>
              <p className="text-lg font-bold">
                {data.reduce((sum, item) => sum + item.orders, 0).toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}