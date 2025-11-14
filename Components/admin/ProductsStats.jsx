'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';

const ProductsStats = () => {
  const containerRef = useRef(null);
  const hasAnimated = useRef(false);
  const [stats, setStats] = useState({
    total: 0,
    categories: 0,
    outOfStock: 0,
    lowStock: 0,
    totalValue: 0,
    inStock: 0,
  });
  const [loading, setLoading] = useState(true);
  const [previousStats, setPreviousStats] = useState({
    total: 0,
    categories: 0,
    outOfStock: 0,
    lowStock: 0,
  });

  useEffect(() => {
    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/products/stats');
      if (!response.ok) throw new Error('Failed to fetch stats');
      
      const data = await response.json();
      
      if (data.success) {
        setPreviousStats({
          total: stats.total,
          categories: stats.categories,
          outOfStock: stats.outOfStock,
          lowStock: stats.lowStock,
        });
        setStats({
          total: data.stats.total || 0,
          categories: data.stats.categories || 0,
          outOfStock: data.stats.outOfStock || 0,
          lowStock: data.stats.lowStock || 0,
          inStock: data.stats.inStock || 0,
          totalValue: data.stats.totalValue || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateChange = (current, previous) => {
    if (previous === 0 && current === 0) return { value: '0', isPositive: true };
    if (previous === 0) return { value: '+' + current, isPositive: true };
    const diff = current - previous;
    if (diff === 0) return { value: '0', isPositive: true };
    return {
      value: (diff > 0 ? '+' : '') + diff,
      isPositive: diff > 0,
    };
  };

  const statsConfig = [
    {
      id: 1,
      label: 'Total Products',
      value: (stats.total || 0).toString(),
      change: calculateChange(stats.total || 0, previousStats.total || 0),
      trend: calculateChange(stats.total || 0, previousStats.total || 0).isPositive ? 'up' : 'down',
      icon: '📦',
      description: 'Active listings',
      color: 'from-black/5 to-black/10',
      link: '/admin/products',
    },
    {
      id: 2,
      label: 'Categories',
      value: (stats.categories || 0).toString(),
      change: calculateChange(stats.categories || 0, previousStats.categories || 0),
      trend: calculateChange(stats.categories || 0, previousStats.categories || 0).isPositive ? 'up' : 'down',
      icon: '🏷️',
      description: 'Product categories',
      color: 'from-black/5 to-black/10',
      link: '/admin/products',
    },
    {
      id: 3,
      label: 'Out of Stock',
      value: (stats.outOfStock || 0).toString(),
      change: calculateChange(stats.outOfStock || 0, previousStats.outOfStock || 0),
      trend: calculateChange(stats.outOfStock || 0, previousStats.outOfStock || 0).isPositive ? 'up' : 'down',
      icon: '⚠️',
      description: 'Needs restock',
      color: 'from-red-50 to-red-100',
      link: '/admin/products?filter=out-of-stock',
    },
    {
      id: 4,
      label: 'Low Stock',
      value: (stats.lowStock || 0).toString(),
      change: calculateChange(stats.lowStock || 0, previousStats.lowStock || 0),
      trend: calculateChange(stats.lowStock || 0, previousStats.lowStock || 0).isPositive ? 'up' : 'down',
      icon: '📊',
      description: 'Below threshold',
      color: 'from-yellow-50 to-yellow-100',
      link: '/admin/products?filter=low-stock',
    },
  ];

  useEffect(() => {
    if (!loading && containerRef.current && !hasAnimated.current) {
      hasAnimated.current = true;

      const cards = Array.from(containerRef.current.children);

      // Set initial state
      gsap.set(cards, {
        opacity: 0,
        y: 30,
      });

      // Animate in with timeline
      const tl = gsap.timeline({
        defaults: {
          ease: 'power2.out',
        },
      });

      tl.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: {
          amount: 0.3,
          from: 'start',
        },
      });

      return () => {
        tl.kill();
      };
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-black/5 to-black/10 rounded-2xl p-6 border border-black/5 animate-pulse"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-black/10 rounded-full" />
              <div className="w-12 h-6 bg-black/10 rounded-full" />
            </div>
            <div className="h-4 bg-black/10 rounded w-1/2 mb-2" />
            <div className="h-8 bg-black/10 rounded w-3/4 mb-2" />
            <div className="h-3 bg-black/10 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statsConfig.map((stat) => (
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
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  stat.change.value === '0'
                    ? 'bg-black/10 text-black/50'
                    : stat.trend === 'up'
                    ? 'bg-black text-white'
                    : 'bg-black/20 text-black/60'
                }`}
              >
                {stat.change.value}
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
                style={{
                  width:
                    stat.label === 'Total Products'
                      ? '100%'
                      : stat.label === 'Out of Stock' || stat.label === 'Low Stock'
                      ? stats.total > 0
                        ? `${Math.min((parseInt(stat.value) / stats.total) * 100, 100)}%`
                        : '0%'
                      : '70%',
                }}
              />
            </div>
          </div>

          {/* Refresh Indicator */}
          <div className="absolute bottom-2 right-2 text-xs text-black/20 group-hover:text-black/40 transition-colors">
            Live
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductsStats;