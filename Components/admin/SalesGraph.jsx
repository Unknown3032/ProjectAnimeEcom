'use client';

import { useEffect, useRef, useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { gsap } from 'gsap';
import { adminAPI } from '@/lib/api/adminApi';

const SalesGraph = ({ initialData }) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const statsRef = useRef(null);
  const [activeView, setActiveView] = useState('area');
  const [activePeriod, setActivePeriod] = useState('30d');
  const [salesData, setSalesData] = useState(initialData || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setSalesData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(titleRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: 'power3.out',
      });

      gsap.from(statsRef.current?.children || [], {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.2,
      });

      gsap.from(containerRef.current.querySelector('.recharts-wrapper'), {
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.4,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [salesData]);

  const handlePeriodChange = async (period) => {
    setActivePeriod(period);
    setLoading(true);
    
    try {
      const response = await adminAPI.getSalesData(period);
      setSalesData(response.data);
    } catch (error) {
      console.error('Failed to fetch sales data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalSales = salesData.reduce((acc, item) => acc + item.sales, 0);
  const totalOrders = salesData.reduce((acc, item) => acc + item.orders, 0);
  const avgOrderValue = totalOrders > 0 ? (totalSales / totalOrders).toFixed(2) : 0;
  const growth = salesData.length > 1 
    ? ((salesData[salesData.length - 1].sales - salesData[0].sales) / salesData[0].sales * 100).toFixed(1)
    : 0;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black border border-white/20 px-4 py-3 rounded-lg shadow-2xl backdrop-blur-sm">
          <p className="text-white text-sm font-medium mb-2">{payload[0].payload.date}</p>
          <div className="space-y-1">
            <p className="text-white/90 text-xs">
              Sales: <span className="font-semibold">${payload[0].value.toLocaleString()}</span>
            </p>
            <p className="text-white/90 text-xs">
              Orders: <span className="font-semibold">{payload[0].payload.orders}</span>
            </p>
            {payload[0].payload.avgOrderValue && (
              <p className="text-white/90 text-xs">
                Avg: <span className="font-semibold">${payload[0].payload.avgOrderValue.toLocaleString()}</span>
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const periods = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
  ];

  return (
    <div ref={containerRef} className="bg-white rounded-2xl p-4 md:p-6 lg:p-8 shadow-lg border border-black/5">
      {/* Header */}
      <div ref={titleRef} className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-black mb-1">Sales Overview</h2>
          <p className="text-xs md:text-sm text-black/50">Track your revenue and orders</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Period Selector */}
          <div className="flex items-center gap-1 bg-black/5 rounded-lg p-1">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => handlePeriodChange(period.value)}
                disabled={loading}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 disabled:opacity-50 ${
                  activePeriod === period.value
                    ? 'bg-black text-white shadow-md'
                    : 'text-black/60 hover:text-black'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-black/5 rounded-lg p-1">
            <button
              onClick={() => setActiveView('area')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
                activeView === 'area'
                  ? 'bg-black text-white shadow-md'
                  : 'text-black/60 hover:text-black'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setActiveView('line')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
                activeView === 'line'
                  ? 'bg-black text-white shadow-md'
                  : 'text-black/60 hover:text-black'
              }`}
            >
              Line
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-gradient-to-br from-black/5 to-black/10 rounded-xl p-3 md:p-4 hover:shadow-md transition-all duration-300 group">
          <p className="text-xs text-black/50 mb-1">Total Revenue</p>
          <p className="text-lg md:text-xl lg:text-2xl font-bold text-black group-hover:scale-105 transition-transform">
            ${totalSales.toLocaleString()}
          </p>
        </div>
        <div className="bg-gradient-to-br from-black/5 to-black/10 rounded-xl p-3 md:p-4 hover:shadow-md transition-all duration-300 group">
          <p className="text-xs text-black/50 mb-1">Total Orders</p>
          <p className="text-lg md:text-xl lg:text-2xl font-bold text-black group-hover:scale-105 transition-transform">
            {totalOrders}
          </p>
        </div>
        <div className="bg-gradient-to-br from-black/5 to-black/10 rounded-xl p-3 md:p-4 hover:shadow-md transition-all duration-300 group">
          <p className="text-xs text-black/50 mb-1">Avg Order Value</p>
          <p className="text-lg md:text-xl lg:text-2xl font-bold text-black group-hover:scale-105 transition-transform">
            ${avgOrderValue}
          </p>
        </div>
        <div className="bg-gradient-to-br from-black/5 to-black/10 rounded-xl p-3 md:p-4 hover:shadow-md transition-all duration-300 group">
          <p className="text-xs text-black/50 mb-1">Growth Rate</p>
          <p className={`text-lg md:text-xl lg:text-2xl font-bold group-hover:scale-105 transition-transform ${
            growth >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {growth >= 0 ? '+' : ''}{growth}%
          </p>
        </div>
      </div>

      {/* Graph */}
      {loading ? (
        <div className="w-full h-[250px] md:h-[350px] lg:h-[400px] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
        </div>
      ) : salesData.length === 0 ? (
        <div className="w-full h-[250px] md:h-[350px] lg:h-[400px] flex items-center justify-center">
          <p className="text-black/40">No sales data available</p>
        </div>
      ) : (
        <div className="w-full h-[250px] md:h-[350px] lg:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            {activeView === 'area' ? (
              <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000000" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#000000" strokeOpacity={0.05} />
                <XAxis 
                  dataKey="date" 
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
                  tickFormatter={(value) => `$${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#000000', strokeOpacity: 0.1 }} />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#000000" 
                  strokeWidth={2}
                  fill="url(#salesGradient)"
                  animationDuration={1000}
                />
              </AreaChart>
            ) : (
              <LineChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#000000" strokeOpacity={0.05} />
                <XAxis 
                  dataKey="date" 
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
                  tickFormatter={(value) => `$${value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value}`}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#000000', strokeOpacity: 0.1 }} />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#000000" 
                  strokeWidth={2.5}
                  dot={{ fill: '#000000', r: 4, strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 6, fill: '#000000', strokeWidth: 2, stroke: '#fff' }}
                  animationDuration={1000}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      )}

      {/* Bottom Info */}
      <div className="mt-6 pt-6 border-t border-black/5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-black rounded-full animate-pulse"></div>
            <span className="text-xs text-black/50">Real-time data updates</span>
          </div>
          <button className="text-xs font-medium text-black hover:underline transition-all inline-flex items-center gap-1 group">
            View Detailed Report 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesGraph;