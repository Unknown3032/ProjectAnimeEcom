'use client';

import { useEffect, useRef, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { gsap } from 'gsap';
import { customerAPI } from "@/lib/apiClient";

const CustomersAnalytics = () => {
  const containerRef = useRef(null);
  const [activePeriod, setActivePeriod] = useState('30d');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [activePeriod]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await customerAPI.getAnalytics(activePeriod);
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      const ctx = gsap.context(() => {
        gsap.from(containerRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.2,
        });
      }, containerRef);

      return () => ctx.revert();
    }
  }, [activePeriod, data]);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black border border-white/20 px-4 py-3 rounded-xl shadow-2xl">
          <p className="text-white text-sm font-medium mb-2">{payload[0].payload.date}</p>
          <div className="space-y-1">
            <p className="text-white/90 text-xs">
              New: <span className="font-semibold">{payload[0].payload.new}</span>
            </p>
            <p className="text-white/90 text-xs">
              Active: <span className="font-semibold">{payload[0].payload.active}</span>
            </p>
            <p className="text-white/90 text-xs">
              Total: <span className="font-semibold">{payload[0].payload.total.toLocaleString()}</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div ref={containerRef} className="bg-white rounded-2xl p-6 shadow-lg border border-black/5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-black">Customer Growth</h3>
          <p className="text-sm text-black/50 mt-1">Track customer acquisition trends</p>
        </div>

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
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="customerGradient" x1="0" y1="0" x2="0" y2="1">
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
                dataKey="new" 
                stroke="#000000" 
                strokeWidth={2}
                fill="url(#customerGradient)"
                animationDuration={1000}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default CustomersAnalytics;