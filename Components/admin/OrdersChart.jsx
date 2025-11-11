'use client';

import { useEffect, useRef, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { gsap } from 'gsap';

const OrdersChart = () => {
  const containerRef = useRef(null);
  const [activeView, setActiveView] = useState('area');
  const [activePeriod, setActivePeriod] = useState('7d');

  const ordersData = {
    '7d': [
      { date: 'Mon', orders: 42, revenue: 1580, completed: 38, cancelled: 4 },
      { date: 'Tue', orders: 38, revenue: 1420, completed: 35, cancelled: 3 },
      { date: 'Wed', orders: 51, revenue: 1890, completed: 47, cancelled: 4 },
      { date: 'Thu', orders: 62, revenue: 2340, completed: 58, cancelled: 4 },
      { date: 'Fri', orders: 78, revenue: 2920, completed: 72, cancelled: 6 },
      { date: 'Sat', orders: 92, revenue: 3450, completed: 86, cancelled: 6 },
      { date: 'Sun', orders: 85, revenue: 3180, completed: 79, cancelled: 6 },
    ],
    '30d': [
      { date: 'Week 1', orders: 185, revenue: 6920, completed: 172, cancelled: 13 },
      { date: 'Week 2', orders: 223, revenue: 8340, completed: 208, cancelled: 15 },
      { date: 'Week 3', orders: 198, revenue: 7400, completed: 184, cancelled: 14 },
      { date: 'Week 4', orders: 256, revenue: 9580, completed: 239, cancelled: 17 },
    ],
    '90d': [
      { date: 'Month 1', orders: 862, revenue: 32260, completed: 803, cancelled: 59 },
      { date: 'Month 2', orders: 947, revenue: 35420, completed: 882, cancelled: 65 },
      { date: 'Month 3', orders: 891, revenue: 33340, completed: 829, cancelled: 62 },
    ],
  };

  const currentData = ordersData[activePeriod];

  const totalOrders = currentData.reduce((acc, item) => acc + item.orders, 0);
  const totalRevenue = currentData.reduce((acc, item) => acc + item.revenue, 0);
  const totalCompleted = currentData.reduce((acc, item) => acc + item.completed, 0);
  const completionRate = ((totalCompleted / totalOrders) * 100).toFixed(1);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, [activePeriod]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black border border-white/20 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-sm">
          <p className="text-white text-sm font-medium mb-2">{payload[0].payload.date}</p>
          <div className="space-y-1">
            <p className="text-white/90 text-xs">
              Orders: <span className="font-semibold">{payload[0].payload.orders}</span>
            </p>
            <p className="text-white/90 text-xs">
              Revenue: <span className="font-semibold">${payload[0].payload.revenue.toLocaleString()}</span>
            </p>
            <p className="text-white/90 text-xs">
              Completed: <span className="font-semibold">{payload[0].payload.completed}</span>
            </p>
            <p className="text-white/90 text-xs">
              Cancelled: <span className="font-semibold">{payload[0].payload.cancelled}</span>
            </p>
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
  ];

  return (
    <div ref={containerRef} className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-black/5">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-black mb-1">Orders Analytics</h2>
          <p className="text-xs md:text-sm text-black/50">Track order trends and performance</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex items-center gap-1 bg-black/5 rounded-lg p-1">
            {periods.map((period) => (
              <button
                key={period.value}
                onClick={() => setActivePeriod(period.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
                  activePeriod === period.value
                    ? 'bg-black text-white shadow-md'
                    : 'text-black/60 hover:text-black'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>

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
              onClick={() => setActiveView('bar')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-300 ${
                activeView === 'bar'
                  ? 'bg-black text-white shadow-md'
                  : 'text-black/60 hover:text-black'
              }`}
            >
              Bar
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-black/5 rounded-xl p-3 hover:bg-black/10 transition-colors">
          <p className="text-xs text-black/50 mb-1">Total Orders</p>
          <p className="text-lg md:text-xl font-bold text-black">{totalOrders}</p>
        </div>
        <div className="bg-black/5 rounded-xl p-3 hover:bg-black/10 transition-colors">
          <p className="text-xs text-black/50 mb-1">Revenue</p>
          <p className="text-lg md:text-xl font-bold text-black">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-black/5 rounded-xl p-3 hover:bg-black/10 transition-colors">
          <p className="text-xs text-black/50 mb-1">Completed</p>
          <p className="text-lg md:text-xl font-bold text-black">{totalCompleted}</p>
        </div>
        <div className="bg-black/5 rounded-xl p-3 hover:bg-black/10 transition-colors">
          <p className="text-xs text-black/50 mb-1">Success Rate</p>
          <p className="text-lg md:text-xl font-bold text-black">{completionRate}%</p>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-[300px] md:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          {activeView === 'area' ? (
            <AreaChart data={currentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
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
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#000000', strokeOpacity: 0.1 }} />
              <Area 
                type="monotone" 
                dataKey="orders" 
                stroke="#000000" 
                strokeWidth={2}
                fill="url(#ordersGradient)"
                animationDuration={1000}
              />
            </AreaChart>
          ) : (
            <BarChart data={currentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#00000010' }} />
              <Bar 
                dataKey="orders" 
                fill="#000000"
                radius={[8, 8, 0, 0]}
                animationDuration={1000}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrdersChart;