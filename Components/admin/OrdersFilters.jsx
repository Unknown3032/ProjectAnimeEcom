'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const OrdersFilters = ({ onFilterChange }) => {
  const containerRef = useRef(null);
  const [activeStatus, setActiveStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');

  const statuses = [
    { value: 'all', label: 'All Orders', count: '2,847' },
    { value: 'pending', label: 'Pending', count: '124' },
    { value: 'processing', label: 'Processing', count: '89' },
    { value: 'shipped', label: 'Shipped', count: '156' },
    { value: 'delivered', label: 'Delivered', count: '2,406' },
    { value: 'cancelled', label: 'Cancelled', count: '72' },
  ];

  const dateRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: 'custom', label: 'Custom Range' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.3,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleStatusChange = (status) => {
    setActiveStatus(status);
    onFilterChange?.({ status, search: searchQuery, dateRange });
  };

  return (
    <div ref={containerRef} className="bg-white rounded-2xl p-6 shadow-lg border border-black/5 space-y-6">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by order ID, customer name, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all text-sm"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40">
            🔍
          </span>
        </div>

        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all text-sm cursor-pointer"
        >
          {dateRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status.value}
            onClick={() => handleStatusChange(status.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 inline-flex items-center gap-2 ${
              activeStatus === status.value
                ? 'bg-black text-white shadow-md'
                : 'bg-black/5 text-black/60 hover:bg-black/10'
            }`}
          >
            <span>{status.label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              activeStatus === status.value
                ? 'bg-white/20'
                : 'bg-black/10'
            }`}>
              {status.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OrdersFilters;