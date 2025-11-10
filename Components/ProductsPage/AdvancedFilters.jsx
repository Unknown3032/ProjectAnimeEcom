'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { filterOptions } from '@/lib/productsData';

export default function AdvancedFilters({ filters, setFilters, onClose, isOpen }) {
  const filterRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.to(overlayRef.current, {
        opacity: 1,
        pointerEvents: 'auto',
        duration: 0.3,
        ease: 'power2.out'
      });

      gsap.fromTo(
        filterRef.current,
        { x: '100%' },
        { 
          x: '0%',
          duration: 0.4,
          ease: 'power3.out'
        }
      );
    } else {
      gsap.to(overlayRef.current, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.3,
        ease: 'power2.in'
      });

      gsap.to(filterRef.current, {
        x: '100%',
        duration: 0.4,
        ease: 'power3.in'
      });
    }
  }, [isOpen]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleTagToggle = (tag) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const resetFilters = () => {
    setFilters({
      priceRange: 'all',
      availability: 'all',
      rating: 'all',
      tags: []
    });
  };

  const activeFilterCount = Object.values(filters).reduce((count, value) => {
    if (Array.isArray(value)) return count + value.length;
    if (value !== 'all') return count + 1;
    return count;
  }, 0);

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black bg-opacity-30 z-40 opacity-0 pointer-events-none mt-8"
        onClick={onClose}
      />

      {/* Filter Panel */}
      <div
        ref={filterRef}
        className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform translate-x-full overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Filters</h2>
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close filters"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {activeFilterCount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                {activeFilterCount} {activeFilterCount === 1 ? 'filter' : 'filters'} active
              </span>
              <button
                onClick={resetFilters}
                className="text-sm font-bold hover:underline transition-all"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Filter Sections */}
        <div className="p-6 space-y-8">
          {/* Price Range */}
          <div className="filter-section">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Price Range</h3>
              {filters.priceRange !== 'all' && (
                <button
                  onClick={() => handleFilterChange('priceRange', 'all')}
                  className="text-xs font-medium text-gray-600 hover:text-black transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-2">
              {filterOptions.priceRanges.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="priceRange"
                    value={option.value}
                    checked={filters.priceRange === option.value}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                    className="w-5 h-5 accent-black"
                  />
                  <span className="group-hover:translate-x-1 transition-transform">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200" />

          {/* Availability */}
          <div className="filter-section">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Availability</h3>
              {filters.availability !== 'all' && (
                <button
                  onClick={() => handleFilterChange('availability', 'all')}
                  className="text-xs font-medium text-gray-600 hover:text-black transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-2">
              {filterOptions.availability.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="availability"
                    value={option.value}
                    checked={filters.availability === option.value}
                    onChange={(e) => handleFilterChange('availability', e.target.value)}
                    className="w-5 h-5 accent-black"
                  />
                  <span className="group-hover:translate-x-1 transition-transform">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200" />

          {/* Rating */}
          <div className="filter-section">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Customer Rating</h3>
              {filters.rating !== 'all' && (
                <button
                  onClick={() => handleFilterChange('rating', 'all')}
                  className="text-xs font-medium text-gray-600 hover:text-black transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-2">
              {filterOptions.ratings.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="rating"
                    value={option.value}
                    checked={filters.rating === option.value}
                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                    className="w-5 h-5 accent-black"
                  />
                  <span className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                    {option.label}
                    {option.value !== 'all' && (
                      <span className="text-black">★</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-200" />

          {/* Tags */}
          <div className="filter-section">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Product Tags</h3>
              {filters.tags.length > 0 && (
                <button
                  onClick={() => setFilters(prev => ({ ...prev, tags: [] }))}
                  className="text-xs font-medium text-gray-600 hover:text-black transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {filterOptions.tags.map((tag) => (
                <button
                  key={tag.value}
                  onClick={() => handleTagToggle(tag.value)}
                  className={`px-4 py-2 border text-sm font-medium transition-all duration-300 ${
                    filters.tags.includes(tag.value)
                      ? 'bg-black text-white border-black'
                      : 'bg-white border-gray-300 hover:border-black'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Apply Button */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="w-full px-6 py-4 bg-black text-white font-bold hover:bg-gray-800 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}