'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const CustomersFilters = ({ onFilterChange }) => {
  const containerRef = useRef(null);
  const [activeSegment, setActiveSegment] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const segments = [
    { value: 'all', label: 'All Customers', count: '2,847' },
    { value: 'active', label: 'Active', count: '1,892' },
    { value: 'new', label: 'New', count: '234' },
    { value: 'vip', label: 'VIP', count: '156' },
    { value: 'inactive', label: 'Inactive', count: '565' },
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name-az', label: 'Name: A to Z' },
    { value: 'name-za', label: 'Name: Z to A' },
    { value: 'spending-high', label: 'Highest Spending' },
    { value: 'spending-low', label: 'Lowest Spending' },
  ];

  const dateRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: '7days', label: 'Last 7 Days' },
    { value: '30days', label: 'Last 30 Days' },
    { value: '90days', label: 'Last 90 Days' },
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

  return (
    <div ref={containerRef} className="bg-white rounded-2xl p-6 shadow-lg border border-black/5 space-y-6">
      {/* Search and Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all text-sm"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40">
            🔍
          </span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-black"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all text-sm cursor-pointer min-w-[180px]"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all text-sm cursor-pointer min-w-[150px]"
          >
            {dateRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Segment Filters */}
      <div className="flex flex-wrap gap-2">
        {segments.map((segment) => (
          <button
            key={segment.value}
            onClick={() => setActiveSegment(segment.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 inline-flex items-center gap-2 ${
              activeSegment === segment.value
                ? 'bg-black text-white shadow-md'
                : 'bg-black/5 text-black/60 hover:bg-black/10'
            }`}
          >
            <span>{segment.label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              activeSegment === segment.value
                ? 'bg-white/20'
                : 'bg-black/10'
            }`}>
              {segment.count}
            </span>
          </button>
        ))}
      </div>

      {/* Active Filters Summary */}
      {(searchQuery || activeSegment !== 'all' || dateRange !== 'all') && (
        <div className="flex items-center gap-2 pt-4 border-t border-black/5">
          <span className="text-xs text-black/50">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <span className="px-3 py-1 bg-black/10 rounded-full text-xs text-black inline-flex items-center gap-2">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-black/60">✕</button>
              </span>
            )}
            {activeSegment !== 'all' && (
              <span className="px-3 py-1 bg-black/10 rounded-full text-xs text-black inline-flex items-center gap-2">
                Segment: {segments.find(s => s.value === activeSegment)?.label}
                <button onClick={() => setActiveSegment('all')} className="hover:text-black/60">✕</button>
              </span>
            )}
            {dateRange !== 'all' && (
              <span className="px-3 py-1 bg-black/10 rounded-full text-xs text-black inline-flex items-center gap-2">
                Period: {dateRanges.find(d => d.value === dateRange)?.label}
                <button onClick={() => setDateRange('all')} className="hover:text-black/60">✕</button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersFilters;