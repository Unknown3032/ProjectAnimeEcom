'use client';

import { useRef, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { gsap } from 'gsap';

export default function CustomerGrowth({ data }) {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 1.6 }
    );
  }, []);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black text-white px-4 py-3 rounded-lg shadow-2xl border border-white/20">
          <p className="text-sm font-medium mb-1">{payload[0].payload.date}</p>
          <p className="text-xs">New Customers: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const totalNewCustomers = data?.reduce((sum, item) => sum + item.newCustomers, 0) || 0;
  const avgPerDay = data && data.length > 0 ? (totalNewCustomers / data.length).toFixed(1) : 0;
  const peakDay = data?.reduce((max, item) => 
    item.newCustomers > (max?.newCustomers || 0) ? item : max
  , {});

  return (
    <div ref={containerRef} className="bg-white border border-black/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-black mb-1">Customer Growth</h2>
        <p className="text-xs text-black/50">New customer acquisitions over the last 30 days</p>
      </div>

      {!data || data.length === 0 ? (
        <div className="h-[250px] flex items-center justify-center text-black/40">
          No customer growth data available
        </div>
      ) : (
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="customerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#000000" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
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
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#000000', strokeOpacity: 0.1 }} />
              <Area 
                type="monotone" 
                dataKey="newCustomers" 
                stroke="#000000" 
                strokeWidth={2}
                fill="url(#customerGradient)"
                animationDuration={800}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Growth Summary */}
      {data && data.length > 0 && (
        <div className="mt-6 pt-6 border-t border-black/5">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-black/40 mb-1">Total New</p>
              <p className="text-lg font-bold">{totalNewCustomers}</p>
            </div>
            <div>
              <p className="text-xs text-black/40 mb-1">Avg per Day</p>
              <p className="text-lg font-bold">{avgPerDay}</p>
            </div>
            <div>
              <p className="text-xs text-black/40 mb-1">Peak Day</p>
              <p className="text-lg font-bold">{peakDay?.newCustomers || 0}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}