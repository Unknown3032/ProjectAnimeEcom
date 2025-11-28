'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// Updated price ranges for INR
const priceRanges = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'under500', label: 'Under ₹500', min: 0, max: 500 },
  { id: '500to1000', label: '₹500 - ₹1,000', min: 500, max: 1000 },
  { id: '1000to2500', label: '₹1,000 - ₹2,500', min: 1000, max: 2500 },
  { id: '2500to5000', label: '₹2,500 - ₹5,000', min: 2500, max: 5000 },
  { id: 'over5000', label: 'Over ₹5,000', min: 5000, max: Infinity },
];

export default function ProductFilters({
  categories = [],
  animes = [],
  selectedCategory,
  selectedAnime,
  priceRange,
  searchQuery,
  onCategoryChange,
  onAnimeChange,
  onPriceRangeChange,
  onSearchChange,
}) {
  const filtersRef = useRef(null);
  const [expandedSection, setExpandedSection] = useState({
    category: true,
    anime: true,
    price: true,
  });
  const [selectedPriceRangeId, setSelectedPriceRangeId] = useState('all');
  const [animeSearch, setAnimeSearch] = useState('');

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

  const handleClearAll = () => {
    setSelectedPriceRangeId('all');
    setAnimeSearch('');
    onSearchChange('');
    if (categories.length > 0) {
      onCategoryChange(categories[0]);
    }
    if (onAnimeChange) {
      onAnimeChange(null);
    }
    onPriceRangeChange({ min: 0, max: Infinity });
  };

  // Filter animes based on search
  const filteredAnimes = animes.filter(anime =>
    anime.name.toLowerCase().includes(animeSearch.toLowerCase())
  );

  // Check if any filters are active
  const hasActiveFilters = 
    selectedCategory?.slug !== 'all' || 
    selectedAnime || 
    selectedPriceRangeId !== 'all' || 
    searchQuery;

  return (
    <div ref={filtersRef} className="bg-white border border-gray-200 p-8 sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="mb-10 pb-8 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-3xl font-bold tracking-tight">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={handleClearAll}
              className="group flex items-center gap-2 px-3 py-1.5 text-xs font-semibold tracking-wider uppercase text-red-600 hover:text-white hover:bg-red-600 border border-red-600 transition-all duration-300"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear
            </button>
          )}
        </div>
        <div className="w-12 h-0.5 bg-gradient-to-r from-black to-gray-400"></div>
      </div>

      {/* Search */}
      <div className="filter-section mb-8">
        <label className="block text-[10px] font-semibold tracking-[0.2em] text-gray-500 mb-4">
          SEARCH PRODUCTS
        </label>
        <div className="relative group">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products..."
            className="w-full px-5 py-4 bg-gray-50 border-2 border-gray-200 text-black placeholder-gray-400 focus:border-black focus:outline-none focus:bg-white transition-all duration-300 text-sm tracking-wide"
          />
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors">
            {searchQuery ? (
              <button
                onClick={() => onSearchChange('')}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="filter-section mb-8">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between mb-5 group"
        >
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-semibold tracking-[0.2em] text-gray-500 cursor-pointer">
              CATEGORY
            </label>
            {selectedCategory?.slug !== 'all' && (
              <span className="flex items-center justify-center w-5 h-5 bg-black text-white text-[10px] font-bold rounded-full">
                1
              </span>
            )}
          </div>
          <span className={`text-gray-400 group-hover:text-black transform transition-transform duration-500 ${
            expandedSection.category ? 'rotate-180' : ''
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </button>
        
        <div className={`space-y-2 transition-all duration-700 ease-out overflow-hidden ${
          expandedSection.category ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="max-h-[300px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
            {categories.map((category) => (
              <button
                key={category._id}
                onClick={() => onCategoryChange(category)}
                className={`w-full text-left px-5 py-4 transition-all duration-300 relative overflow-hidden text-sm tracking-wide ${
                  selectedCategory?._id === category._id
                    ? 'bg-black text-white shadow-lg scale-[1.02]'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent hover:border-gray-300 hover:scale-[1.01]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="relative z-10 font-semibold">
                    {category.name}
                  </span>
                  {category.productCount && (
                    <span className={`text-xs ${
                      selectedCategory?._id === category._id ? 'text-white/70' : 'text-gray-400'
                    }`}>
                      {category.productCount}
                    </span>
                  )}
                </div>
                {selectedCategory?._id === category._id && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-white"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Anime Filter */}
      {animes && animes.length > 0 && (
        <div className="filter-section mb-8">
          <button
            onClick={() => toggleSection('anime')}
            className="w-full flex items-center justify-between mb-5 group"
          >
            <div className="flex items-center gap-2">
              <label className="text-[10px] font-semibold tracking-[0.2em] text-gray-500 cursor-pointer">
                ANIME SERIES
              </label>
              {selectedAnime && (
                <span className="flex items-center justify-center w-5 h-5 bg-black text-white text-[10px] font-bold rounded-full">
                  1
                </span>
              )}
            </div>
            <span className={`text-gray-400 group-hover:text-black transform transition-transform duration-500 ${
              expandedSection.anime ? 'rotate-180' : ''
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </button>
          
          <div className={`transition-all duration-700 ease-out overflow-hidden ${
            expandedSection.anime ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
          }`}>
            {/* Anime Search */}
            <div className="mb-3">
              <div className="relative">
                <input
                  type="text"
                  value={animeSearch}
                  onChange={(e) => setAnimeSearch(e.target.value)}
                  placeholder="Search anime..."
                  className="w-full px-4 py-2.5 bg-gray-50 border-2 border-gray-200 text-sm focus:border-black focus:outline-none focus:bg-white transition-all tracking-wide"
                />
                {animeSearch && (
                  <button
                    onClick={() => setAnimeSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black p-1 hover:bg-gray-200 rounded-full transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Anime List */}
            <div className="max-h-[300px] overflow-y-auto pr-1 space-y-2 custom-scrollbar">
              {/* All Anime Option */}
              <button
                onClick={() => onAnimeChange && onAnimeChange(null)}
                className={`w-full text-left px-5 py-3.5 transition-all duration-300 relative overflow-hidden text-sm tracking-wide ${
                  !selectedAnime
                    ? 'bg-black text-white shadow-lg scale-[1.02]'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent hover:border-gray-300 hover:scale-[1.01]'
                }`}
              >
                <span className="relative z-10 font-semibold">All Anime</span>
                {!selectedAnime && (
                  <div className="absolute left-0 top-0 h-full w-1 bg-white"></div>
                )}
              </button>

              {/* Filtered Anime List */}
              {filteredAnimes.length > 0 ? (
                filteredAnimes.map((anime) => (
                  <button
                    key={anime._id}
                    onClick={() => onAnimeChange && onAnimeChange(anime.name)}
                    className={`w-full text-left px-5 py-3.5 transition-all duration-300 relative overflow-hidden text-sm tracking-wide ${
                      selectedAnime === anime.name
                        ? 'bg-black text-white shadow-lg scale-[1.02]'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent hover:border-gray-300 hover:scale-[1.01]'
                    }`}
                  >
                    <div className="relative z-10">
                      <div className="font-semibold">{anime.name}</div>
                      {anime.productCount > 0 && (
                        <div className={`text-xs mt-1 ${
                          selectedAnime === anime.name ? 'text-white/70' : 'text-gray-400'
                        }`}>
                          {anime.productCount} {anime.productCount === 1 ? 'product' : 'products'}
                        </div>
                      )}
                    </div>
                    {selectedAnime === anime.name && (
                      <div className="absolute left-0 top-0 h-full w-1 bg-white"></div>
                    )}
                  </button>
                ))
              ) : (
                <div className="px-4 py-8 text-center">
                  <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-gray-500 mb-2">No anime found</p>
                  <button
                    onClick={() => setAnimeSearch('')}
                    className="text-xs text-black hover:underline"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Price Range - UPDATED FOR INR */}
      <div className="filter-section mb-8">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between mb-5 group"
        >
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-semibold tracking-[0.2em] text-gray-500 cursor-pointer">
              PRICE RANGE (INR)
            </label>
            {selectedPriceRangeId !== 'all' && (
              <span className="flex items-center justify-center w-5 h-5 bg-black text-white text-[10px] font-bold rounded-full">
                1
              </span>
            )}
          </div>
          <span className={`text-gray-400 group-hover:text-black transform transition-transform duration-500 ${
            expandedSection.price ? 'rotate-180' : ''
          }`}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
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
              className={`w-full text-left px-5 py-4 transition-all duration-300 relative overflow-hidden text-sm tracking-wide ${
                selectedPriceRangeId === range.id
                  ? 'bg-black text-white shadow-lg scale-[1.02]'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent hover:border-gray-300 hover:scale-[1.01]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="relative z-10 font-semibold">
                  {range.label}
                </span>
                {selectedPriceRangeId === range.id && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
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
          <div className="w-2 h-2 border border-black rotate-45 animate-pulse"></div>
          <div className="w-10 h-px bg-gradient-to-r from-transparent via-black to-transparent"></div>
          <div className="w-2 h-2 bg-black animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="w-10 h-px bg-gradient-to-r from-transparent via-black to-transparent"></div>
          <div className="w-2 h-2 border border-black rotate-45 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </div>
  );
}