'use client';

import { useEffect, useRef, useState } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { gsap } from 'gsap';

const OrdersRevenueChart = () => {
  const containerRef = useRef(null);
  const [activePeriod, setActivePeriod] = useState('30d');

  const data = {
    '7d': [
      { date: 'Mon', orders: 42, revenue: 1580 },
      { date: 'Tue', orders: 38, revenue: 1420 },
      { date: 'Wed', orders: 51, revenue: 1890 },
      { date: 'Thu', orders: 62, revenue: 2340 },
      { date: 'Fri', orders: 78, revenue: 2920 },
      { date: 'Sat', orders: 92, revenue: 3450 },
      { date: 'Sun', orders: 85, revenue: 3180 },
    ],
    '30d': [
      { date: 'Week 1', orders: 185, revenue: 6920 },
      { date: 'Week 2', orders: 223, revenue: 8340 },
      { date: 'Week 3', orders: 198, revenue: 7400 },
      { date: 'Week 4', orders: 256, revenue: 9580 },
    ],
  };

  const currentData = data[activePeriod];

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
        <div className="bg-black border border-white/20 px-4 py-3 rounded-xl shadow-2xl">
          <p className="text-white text-sm font-medium mb-2">{payload[0].payload.date}</p>
          <div className="space-y-1">
            <p className="text-white/90 text-xs">
              Orders: <span className="font-semibold">{payload[1].value}</span>
            </p>
            <p className="text-white/90 text-xs">
              Revenue: <span className="font-semibold">${payload[0].value.toLocaleString()}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div ref={containerRef} className="bg-white rounded-2xl p-4 md:p-6 shadow-lg border border-black/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-black">Orders vs Revenue</h3>
        
        <div className="flex items-center gap-1 bg-black/5 rounded-lg p-1">
          <button
            onClick={() => setActivePeriod('7d')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activePeriod === '7d'
                ? 'bg-black text-white'
                : 'text-black/60 hover:text-black'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setActivePeriod('30d')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activePeriod === '30d'
                ? 'bg-black text-white'
                : 'text-black/60 hover:text-black'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={currentData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#000000" strokeOpacity={0.05} />
            <XAxis 
              dataKey="date"
              stroke="#000000"
              strokeOpacity={0.3}
              tick={{ fill: '#000000', opacity: 0.5, fontSize: 11 }}
              tickLine={false}
            />
            <YAxis 
              yAxisId="left"
              stroke="#000000"
              strokeOpacity={0.3}
              tick={{ fill: '#000000', opacity: 0.5, fontSize: 11 }}
              tickLine={false}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#000000"
              strokeOpacity={0.3}
              tick={{ fill: '#000000', opacity: 0.5, fontSize: 11 }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              yAxisId="right"
              dataKey="orders" 
              fill="#00000020"
              radius={[8, 8, 0, 0]}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="revenue" 
              stroke="#000000"
              strokeWidth={2}
              dot={{ fill: '#000000', r: 4 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-black rounded-full" />
          <span className="text-black/60">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-black/20 rounded-sm" />
          <span className="text-black/60">Orders</span>
        </div>
      </div>
    </div>
  );
};

export default OrdersRevenueChart;