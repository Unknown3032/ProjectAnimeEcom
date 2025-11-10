'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { filterOptions } from '@/lib/productsData';

export default function ActiveFilters({ filters, setFilters }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        '.filter-chip',
        { opacity: 0, scale: 0.9 },
        { 
          opacity: 1, 
          scale: 1,
          duration: 0.2,
          stagger: 0.03,
          ease: 'power2.out'
        }
      );
    }
  }, [filters]);

  const hasActiveFilters = 
    filters.priceRange !== 'all' ||
    filters.availability !== 'all' ||
    filters.rating !== 'all' ||
    filters.tags.length > 0;

  if (!hasActiveFilters) return null;

  const clearAllFilters = () => {
    setFilters({
      priceRange: 'all',
      availability: 'all',
      rating: 'all',
      tags: []
    });
  };

  const removeFilter = (filterType, value = null) => {
    if (filterType === 'tags' && value) {
      setFilters(prev => ({
        ...prev,
        tags: prev.tags.filter(t => t !== value)
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: 'all'
      }));
    }
  };

  const getFilterLabel = (type, value) => {
    const option = filterOptions[type]?.find(opt => opt.value === value);
    return option?.label || value;
  };

  return (
    <div 
      ref={containerRef}
      className="container mx-auto px-4 py-4 border-b border-gray-200 bg-white pt-5"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-sm font-bold text-gray-700">Active:</span>

        {/* Price Range */}
        {filters.priceRange !== 'all' && (
          <div className="filter-chip flex items-center gap-2 px-3 py-1.5 bg-white border border-black text-sm font-medium">
            <span>{getFilterLabel('priceRanges', filters.priceRange)}</span>
            <button
              onClick={() => removeFilter('priceRange')}
              className="hover:scale-110 transition-transform"
              aria-label="Remove filter"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Availability */}
        {filters.availability !== 'all' && (
          <div className="filter-chip flex items-center gap-2 px-3 py-1.5 bg-white border border-black text-sm font-medium">
            <span>{getFilterLabel('availability', filters.availability)}</span>
            <button
              onClick={() => removeFilter('availability')}
              className="hover:scale-110 transition-transform"
              aria-label="Remove filter"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Rating */}
        {filters.rating !== 'all' && (
          <div className="filter-chip flex items-center gap-2 px-3 py-1.5 bg-white border border-black text-sm font-medium">
            <span>{getFilterLabel('ratings', filters.rating)}</span>
            <button
              onClick={() => removeFilter('rating')}
              className="hover:scale-110 transition-transform"
              aria-label="Remove filter"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Tags */}
        {filters.tags.map((tag) => (
          <div 
            key={tag}
            className="filter-chip flex items-center gap-2 px-3 py-1.5 bg-white border border-black text-sm font-medium"
          >
            <span>{getFilterLabel('tags', tag)}</span>
            <button
              onClick={() => removeFilter('tags', tag)}
              className="hover:scale-110 transition-transform"
              aria-label="Remove filter"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {/* Clear All Button */}
        <button
          onClick={clearAllFilters}
          className="ml-auto px-4 py-1.5 text-sm font-bold text-black hover:underline transition-all"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}