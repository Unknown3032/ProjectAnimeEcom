'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

const priceRanges = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'under25', label: 'Under $25', min: 0, max: 25 },
  { id: '25to50', label: '$25 - $50', min: 25, max: 50 },
  { id: '50to100', label: '$50 - $100', min: 50, max: 100 },
  { id: '100to200', label: '$100 - $200', min: 100, max: 200 },
  { id: 'over200', label: 'Over $200', min: 200, max: Infinity },
];

export default function ProductFilters({
  categories = [],
  selectedCategory,
  priceRange,
  searchQuery,
  onCategoryChange,
  onPriceRangeChange,
  onSearchChange,
}) {
  const filtersRef = useRef(null);
  const [expandedSection, setExpandedSection] = useState({
    category: true,
    price: true,
  });
  const [selectedPriceRangeId, setSelectedPriceRangeId] = useState('all');

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.filter-section', {
        opacity: 0,
        y: 30,
        stagger: 0.15,
        duration: 1,
        ease: 'expo.out',
      });
    }, filtersRef);

    return () => ctx.revert();
  }, []);

  const toggleSection = (section) => {
    setExpandedSection(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handlePriceRangeChange = (range) => {
    setSelectedPriceRangeId(range.id);
    onPriceRangeChange({ min: range.min, max: range.max });
  };

  return (
    <div ref={filtersRef} className="bg-white border border-gray-200 p-8 sticky top-8">
      {/* Header */}
      <div className="mb-10 pb-8 border-b border-gray-200">
        <h3 className="font-display text-3xl font-bold tracking-tight mb-2">Filters</h3>
        <div className="w-12 h-0.5 bg-black"></div>
      </div>

      {/* Search */}
      <div className="filter-section mb-8">
        <label className="block text-[10px] font-semibold tracking-[0.2em] text-gray-500 mb-4">
          SEARCH
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full px-5 py-4 bg-gray-50 border border-gray-200 text-black placeholder-gray-400 focus:border-black focus:outline-none focus:bg-white transition-all duration-500 text-sm tracking-wide"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="filter-section mb-8">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between mb-5 group"
        >
          <label className="text-[10px] font-semibold tracking-[0.2em] text-gray-500 cursor-pointer">
            CATEGORY
          </label>
          <span className={`text-gray-400 transform transition-transform duration-500 ${
            expandedSection.category ? 'rotate-180' : ''
          }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
        
        <div className={`space-y-2 transition-all duration-700 ease-out overflow-hidden ${
          expandedSection.category ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          {categories.map((category) => (
            <button
              key={category._id}
              onClick={() => onCategoryChange(category)}
              className={`w-full text-left px-5 py-4 transition-all duration-500 relative overflow-hidden group/btn text-sm tracking-wide ${
                selectedCategory?._id === category._id
                  ? 'bg-black text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200'
              }`}
            >
              <span className="relative z-10 font-medium">
                {category.name}
              </span>
              {selectedCategory?._id === category._id && (
                <div className="absolute left-0 top-0 h-full w-1 bg-white"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="filter-section mb-8">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between mb-5 group"
        >
          <label className="text-[10px] font-semibold tracking-[0.2em] text-gray-500 cursor-pointer">
            PRICE RANGE
          </label>
          <span className={`text-gray-400 transform transition-transform duration-500 ${
            expandedSection.price ? 'rotate-180' : ''
          }`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
        
        <div className={`space-y-2 transition-all duration-700 ease-out overflow-hidden ${
          expandedSection.price ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          {priceRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => handlePriceRangeChange(range)}
              className={`w-full text-left px-5 py-4 transition-all duration-500 relative overflow-hidden group/btn text-sm tracking-wide ${
                selectedPriceRangeId === range.id
                  ? 'bg-black text-white'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent hover:border-gray-200'
              }`}
            >
              <span className="relative z-10 font-medium">
                {range.label}
              </span>
              {selectedPriceRangeId === range.id && (
                <div className="absolute left-0 top-0 h-full w-1 bg-white"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Decorative footer */}
      <div className="pt-8 mt-8 border-t border-gray-200">
        <div className="flex items-center justify-center space-x-3 opacity-20">
          <div className="w-2 h-2 border border-black rotate-45"></div>
          <div className="w-8 h-px bg-black"></div>
          <div className="w-2 h-2 bg-black"></div>
          <div className="w-8 h-px bg-black"></div>
          <div className="w-2 h-2 border border-black rotate-45"></div>
        </div>
      </div>
    </div>
  );
}