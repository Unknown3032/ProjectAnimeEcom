'use client';

import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const ProductsFilters = ({ onFilterChange }) => {
  const containerRef = useRef(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [stockFilter, setStockFilter] = useState('all');

  const categories = [
    { value: 'all', label: 'All Products', count: '342' },
    { value: 'figures', label: 'Figures', count: '89' },
    { value: 'posters', label: 'Posters', count: '124' },
    { value: 'keychains', label: 'Keychains', count: '67' },
    { value: 'clothing', label: 'Clothing', count: '45' },
    { value: 'accessories', label: 'Accessories', count: '52' },
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-az', label: 'Name: A to Z' },
    { value: 'popular', label: 'Most Popular' },
  ];

  const stockOptions = [
    { value: 'all', label: 'All Stock Levels' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' },
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
            placeholder="Search products by name, SKU, or category..."
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
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
            className="px-4 py-3 bg-black/5 border border-black/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/20 transition-all text-sm cursor-pointer min-w-[180px]"
          >
            {stockOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setActiveCategory(category.value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 inline-flex items-center gap-2 ${
              activeCategory === category.value
                ? 'bg-black text-white shadow-md'
                : 'bg-black/5 text-black/60 hover:bg-black/10'
            }`}
          >
            <span>{category.label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              activeCategory === category.value
                ? 'bg-white/20'
                : 'bg-black/10'
            }`}>
              {category.count}
            </span>
          </button>
        ))}
      </div>

      {/* Active Filters Summary */}
      {(searchQuery || activeCategory !== 'all' || stockFilter !== 'all') && (
        <div className="flex items-center gap-2 pt-4 border-t border-black/5">
          <span className="text-xs text-black/50">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {searchQuery && (
              <span className="px-3 py-1 bg-black/10 rounded-full text-xs text-black inline-flex items-center gap-2">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-black/60">✕</button>
              </span>
            )}
            {activeCategory !== 'all' && (
              <span className="px-3 py-1 bg-black/10 rounded-full text-xs text-black inline-flex items-center gap-2">
                Category: {categories.find(c => c.value === activeCategory)?.label}
                <button onClick={() => setActiveCategory('all')} className="hover:text-black/60">✕</button>
              </span>
            )}
            {stockFilter !== 'all' && (
              <span className="px-3 py-1 bg-black/10 rounded-full text-xs text-black inline-flex items-center gap-2">
                Stock: {stockOptions.find(s => s.value === stockFilter)?.label}
                <button onClick={() => setStockFilter('all')} className="hover:text-black/60">✕</button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsFilters;