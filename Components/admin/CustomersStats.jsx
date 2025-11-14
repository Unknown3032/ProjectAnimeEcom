'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { customerAPI } from "@/lib/apiClient";

const CustomersStats = () => {
  const containerRef = useRef(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📊 Fetching customer stats...');
      
      const response = await customerAPI.getStats();
      console.log('✅ Stats received:', response);
      
      if (response.success && response.stats) {
        setStats(response.stats);
      } else {
        throw new Error('Invalid stats response');
      }
    } catch (error) {
      console.error('❌ Failed to fetch stats:', error);
      setError(error.message || 'Failed to load statistics');
      
      // Set default stats so UI doesn't break
      setStats({
        totalCustomers: { value: 0, change: '+0%' },
        activeCustomers: { value: 0, change: '+0%' },
        newCustomers: { value: 0, change: '+0%' },
        customerLTV: { value: 0, change: '+0%' }
      });
    } finally {
      setLoading(false);
    }
  };

  // GSAP Animation - runs after loading completes
  useEffect(() => {
    if (!loading && stats && containerRef.current) {
      const cards = containerRef.current.children;
      
      // Kill any existing animations
      gsap.killTweensOf(cards);
      
      // Create animation timeline
      const tl = gsap.timeline();
      
      // Set initial state
      tl.set(cards, {
        opacity: 0,
        y: 30,
        scale: 0.95
      });
      
      // Animate to final state
      tl.to(cards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        clearProps: 'all' // Clear inline styles after animation
      });

      return () => {
        tl.kill();
      };
    }
  }, [loading, stats]);

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gradient-to-br from-black/5 to-black/10 rounded-2xl p-6 animate-pulse border border-black/5">
            <div className="h-8 w-8 bg-black/10 rounded mb-4" />
            <div className="h-4 w-20 bg-black/10 rounded mb-2" />
            <div className="h-8 w-24 bg-black/10 rounded mb-2" />
            <div className="h-3 w-32 bg-black/10 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // Error state
  if (error && !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <p className="text-red-800 font-semibold mb-2">Failed to load statistics</p>
        <p className="text-red-600 text-sm mb-4">{error}</p>
        <button
          onClick={fetchStats}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) return null;

  // Safely get stat values with fallbacks
  const getStatValue = (statObj) => {
    return {
      value: statObj?.value ?? 0,
      change: statObj?.change ?? '+0%'
    };
  };

  const totalCustomers = getStatValue(stats.totalCustomers);
  const activeCustomers = getStatValue(stats.activeCustomers);
  const newCustomers = getStatValue(stats.newCustomers);
  const customerLTV = getStatValue(stats.customerLTV);

  const statItems = [
    {
      id: 1,
      label: 'Total Customers',
      value: typeof totalCustomers.value === 'number' 
        ? totalCustomers.value.toLocaleString() 
        : totalCustomers.value,
      change: totalCustomers.change,
      trend: totalCustomers.change.includes('+') ? 'up' : 'down',
      icon: '👥',
      description: 'Registered users',
      color: 'from-black/5 to-black/10'
    },
    {
      id: 2,
      label: 'Active Customers',
      value: typeof activeCustomers.value === 'number'
        ? activeCustomers.value.toLocaleString()
        : activeCustomers.value,
      change: activeCustomers.change,
      trend: activeCustomers.change.includes('+') ? 'up' : 'down',
      icon: '✨',
      description: 'Last 30 days',
      color: 'from-black/5 to-black/10'
    },
    {
      id: 3,
      label: 'New This Month',
      value: typeof newCustomers.value === 'number'
        ? newCustomers.value.toLocaleString()
        : newCustomers.value,
      change: newCustomers.change,
      trend: newCustomers.change.includes('+') ? 'up' : 'down',
      icon: '🆕',
      description: 'New signups',
      color: 'from-black/5 to-black/10'
    },
    {
      id: 4,
      label: 'Customer LTV',
      value: typeof customerLTV.value === 'number'
        ? `$${Math.round(customerLTV.value).toLocaleString()}`
        : customerLTV.value,
      change: customerLTV.change,
      trend: customerLTV.change.includes('+') ? 'up' : 'down',
      icon: '💎',
      description: 'Average lifetime value',
      color: 'from-black/5 to-black/10'
    },
  ];

  return (
    <>
      <div 
        ref={containerRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
      >
        {statItems.map((stat) => (
          <div
            key={stat.id}
            className={`bg-gradient-to-br ${stat.color} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group cursor-pointer border border-black/5 relative overflow-hidden`}
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
          </div>
        ))}
      </div>
      
      {/* Show error indicator if there was an error but we're showing fallback data */}
      {error && (
        <div className="mt-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center justify-between">
            <p className="text-yellow-800 text-sm">
              ⚠️ Showing cached data. Failed to fetch latest statistics.
            </p>
            <button
              onClick={fetchStats}
              className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomersStats;