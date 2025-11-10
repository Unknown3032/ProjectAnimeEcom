'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import gsap from 'gsap';
import { categories } from '@/lib/productsData';

export default function ProductFilter({ 
  sortBy, 
  setSortBy, 
  viewMode, 
  setViewMode, 
  productCount,
  onOpenFilters,
  activeFilterCount 
}) {
  const params = useParams();
  const currentSlug = params.slug || 'all';
  const categoriesRef = useRef(null);

  const toggleCategories = () => {
    const isOpen = categoriesRef.current.style.maxHeight !== '0px';
    
    if (isOpen) {
      gsap.to(categoriesRef.current, {
        maxHeight: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut'
      });
    } else {
      gsap.set(categoriesRef.current, { maxHeight: 'auto' });
      const height = categoriesRef.current.offsetHeight;
      gsap.fromTo(categoriesRef.current,
        { maxHeight: 0, opacity: 0 },
        { maxHeight: height, opacity: 1, duration: 0.3, ease: 'power2.inOut' }
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Categories Navigation - Mobile Dropdown */}
        <div className="lg:hidden">
          <button
            onClick={toggleCategories}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm font-bold hover:border-black transition-colors flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <span className="text-xl">{categories.find(c => c.slug === currentSlug)?.icon}</span>
              {categories.find(c => c.slug === currentSlug)?.name}
            </span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div 
            ref={categoriesRef}
            style={{ maxHeight: 0, opacity: 0, overflow: 'hidden' }}
            className="mt-2 bg-white border-2 border-gray-200 rounded-lg"
          >
            <div className="p-2 space-y-1">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/productspage/${category.slug}`}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                    currentSlug === category.slug
                      ? 'bg-black text-white font-bold'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <span className="text-xl">{category.icon}</span>
                  <span>{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Categories Navigation - Desktop */}
        <div className="hidden lg:flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/productspage/${category.slug}`}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                currentSlug === category.slug
                  ? 'bg-black text-white shadow-lg scale-105'
                  : 'bg-gray-100 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span>{category.name}</span>
            </Link>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Sort Dropdown */}
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none w-full sm:w-auto px-4 py-2.5 pr-10 border-2 border-gray-300 rounded-lg text-sm font-bold hover:border-black transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
              <option value="rating">Highest Rated</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Filter Button */}
          <button
            onClick={onOpenFilters}
            className="relative px-4 py-2.5 border-2 border-gray-300 rounded-lg hover:border-black transition-colors flex items-center gap-2 font-bold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white text-xs font-bold rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 transition-colors ${
                viewMode === 'grid' ? 'bg-black text-white' : 'hover:bg-gray-100'
              }`}
              aria-label="Grid view"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2.5 transition-colors ${
                viewMode === 'list' ? 'bg-black text-white' : 'hover:bg-gray-100'
              }`}
              aria-label="List view"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}