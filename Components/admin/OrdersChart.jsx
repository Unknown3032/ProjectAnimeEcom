'use client';

import { useEffect, useRef, useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { gsap } from 'gsap';

const OrdersChart = () => {
  const containerRef = useRef(null);
  const [activeView, setActiveView] = useState('area');
  const [activePeriod, setActivePeriod] = useState('7days');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, [activePeriod]);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/orders/stats?period=${activePeriod}`);
      const data = await response.json();

      if (data.success) {
        // Format trend data for chart
        const formattedData = data.stats.trendData.map(item => ({
          date: new Date(item._id).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
          }),
          orders: item.orders,
          revenue: item.revenue,
          completed: item.completed,
          cancelled: item.cancelled
        }));
        
        setChartData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && chartData.length > 0) {
      const ctx = gsap.context(() => {
        gsap.from(containerRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: 'power2.out',
        });
      }, containerRef);

      return () => ctx.revert();
    }
  }, [loading, chartData]);

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
    { value: '7days', label: '7 Days' },
    { value: '30days', label: '30 Days' },
    { value: '90days', label: '90 Days' },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-black/5">
        <div className="animate-pulse">
          <div className="h-8 bg-black/5 rounded mb-4 w-1/3" />
          <div className="h-[350px] bg-black/5 rounded" />
        </div>
      </div>
    );
  }

  const totalOrders = chartData.reduce((acc, item) => acc + item.orders, 0);
  const totalRevenue = chartData.reduce((acc, item) => acc + item.revenue, 0);
  const totalCompleted = chartData.reduce((acc, item) => acc + item.completed, 0);
  const completionRate = totalOrders > 0 ? ((totalCompleted / totalOrders) * 100).toFixed(1) : 0;

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
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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