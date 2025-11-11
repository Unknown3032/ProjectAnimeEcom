'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const OrdersStats = () => {
  const containerRef = useRef(null);

  const stats = [
    {
      id: 1,
      label: 'Total Orders',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: '📦',
      color: 'from-black/5 to-black/10'
    },
    {
      id: 2,
      label: 'Pending',
      value: '124',
      change: '+5.2%',
      trend: 'up',
      icon: '⏳',
      color: 'from-black/5 to-black/10'
    },
    {
      id: 3,
      label: 'Completed',
      value: '2,651',
      change: '+18.3%',
      trend: 'up',
      icon: '✓',
      color: 'from-black/5 to-black/10'
    },
    {
      id: 4,
      label: 'Cancelled',
      value: '72',
      change: '-3.1%',
      trend: 'down',
      icon: '✕',
      color: 'from-black/5 to-black/10'
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current.children, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat) => (
        <div
          key={stat.id}
          className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer border border-black/5`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
              {stat.icon}
            </div>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${
              stat.trend === 'up' 
                ? 'bg-black text-white' 
                : 'bg-black/20 text-black/60'
            }`}>
              {stat.change}
            </span>
          </div>
          
          <p className="text-sm text-black/50 mb-2">{stat.label}</p>
          <p className="text-3xl font-bold text-black group-hover:scale-105 transition-transform duration-300">
            {stat.value}
          </p>

          <div className="mt-4 h-1 bg-black/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-black rounded-full transition-all duration-1000"
              style={{ width: stat.trend === 'up' ? '70%' : '30%' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersStats;