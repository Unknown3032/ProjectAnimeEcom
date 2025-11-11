'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';

const ProductsStats = () => {
  const containerRef = useRef(null);

  const stats = [
    {
      id: 1,
      label: 'Total Products',
      value: '342',
      change: '+12',
      trend: 'up',
      icon: '📦',
      description: 'Active listings',
      color: 'from-black/5 to-black/10',
      link: '/admin/products'
    },
    {
      id: 2,
      label: 'Categories',
      value: '24',
      change: '+3',
      trend: 'up',
      icon: '🏷️',
      description: 'Product categories',
      color: 'from-black/5 to-black/10',
      link: '/admin/products'
    },
    {
      id: 3,
      label: 'Out of Stock',
      value: '18',
      change: '-5',
      trend: 'down',
      icon: '⚠️',
      description: 'Needs restock',
      color: 'from-black/5 to-black/10',
      link: '/admin/products?filter=out-of-stock'
    },
    {
      id: 4,
      label: 'Low Stock',
      value: '42',
      change: '+8',
      trend: 'up',
      icon: '📊',
      description: 'Below threshold',
      color: 'from-black/5 to-black/10',
      link: '/admin/products?filter=low-stock'
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
        <Link
          key={stat.id}
          href={stat.link}
          className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer border border-black/5 relative overflow-hidden block`}
        >
          {/* Background Icon */}
          <div className="absolute -right-4 -top-4 text-6xl opacity-5 group-hover:scale-110 transition-transform duration-500">
            {stat.icon}
          </div>

          <div className="relative z-10">
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
            
            <p className="text-sm text-black/50 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-black group-hover:scale-105 transition-transform duration-300 mb-2">
              {stat.value}
            </p>
            <p className="text-xs text-black/40">{stat.description}</p>

            <div className="mt-4 h-1 bg-black/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-black rounded-full transition-all duration-1000"
                style={{ width: stat.trend === 'up' ? '70%' : '40%' }}
              />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductsStats;