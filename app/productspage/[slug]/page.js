'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { gsap } from 'gsap';
import HeroBanner from '../../../Components/Products//HeroBanner';
import CategoryBanner from '../../../Components/Products//CategoryBanner';
import ProductFilters from '../../../Components/Products//ProductFilters';
import ProductGrid from '../../../Components/Products//ProductGrid';
import { getCategories } from '@/lib/api/categories';
import { getAnimes } from '@/lib/api/animes'; // Create this

export default function ProductsPage() {
  const params = useParams();
  const categorySlug = params.slug || 'all';

  const [categories, setCategories] = useState([]);
  const [animes, setAnimes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedAnime, setSelectedAnime] = useState(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const progressBarRef = useRef(null);

  // Fetch categories and animes on mount
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch categories
        const categoriesResponse = await getCategories({ 
          includeInactive: false 
        });

        // Fetch animes
        const animesResponse = await getAnimes();
        
        if (categoriesResponse.success) {
          const allCategory = {
            _id: 'all',
            name: 'All Products',
            slug: 'all',
            description: 'Browse our entire collection',
            tagline: 'Complete Collection',
            image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&h=400&fit=crop',
            isActive: true
          };
          
          const categoriesList = [allCategory, ...categoriesResponse.data];
          setCategories(categoriesList);
          
          const foundCategory = categoriesList.find(cat => cat.slug === categorySlug);
          setSelectedCategory(foundCategory || allCategory);
          
          setError(null);
        } else {
          setError(categoriesResponse.error || 'Failed to load categories');
        }

        // Set animes
        if (animesResponse && animesResponse.success) {
          setAnimes(animesResponse.data || []);
        }

      } catch (error) {
        console.error('Failed to fetch data:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [categorySlug]);

  // Update selected category when slug changes
  useEffect(() => {
    if (categories.length > 0 && categorySlug) {
      const foundCategory = categories.find(cat => cat.slug === categorySlug);
      if (foundCategory) {
        setSelectedCategory(foundCategory);
      }
    }
  }, [categorySlug, categories]);

  // Scroll progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${scrollProgress}%`,
        duration: 0.2,
        ease: 'none',
      });
    }
  }, [scrollProgress]);

  const handleFilterToggle = () => {
    setMobileFiltersOpen(!mobileFiltersOpen);
  };

  const handleClearFilters = () => {
    setPriceRange({ min: 0, max: Infinity });
    setSearchQuery('');
    setSelectedAnime(null);
    const allCategory = categories.find(cat => cat.slug === 'all');
    if (allCategory) {
      setSelectedCategory(allCategory);
      window.history.pushState(null, '', '/products/all');
    }
  };

  // Prevent body scroll when mobile filters are open
  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileFiltersOpen]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm tracking-[0.3em] text-gray-500 font-medium">LOADING...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-100 z-50">
        <div ref={progressBarRef} className="h-full bg-black"></div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-b border-red-200 px-4 py-3">
          <div className="max-w-[1800px] mx-auto">
            <p className="text-sm text-red-800 text-center">{error}</p>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="relative">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <HeroBanner />
          {selectedCategory && <CategoryBanner category={selectedCategory} />}

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Filters Sidebar */}
            <aside
              className={`
                lg:w-80 xl:w-96 lg:block
                ${mobileFiltersOpen ? 'block' : 'hidden'}
                fixed lg:sticky top-0 lg:top-8
                inset-0 lg:inset-auto
                bg-white lg:bg-transparent
                z-[60] lg:z-auto
                p-6 lg:p-0
                overflow-y-auto
                lg:h-[calc(100vh-4rem)]
              `}
            >
              {/* Mobile Close Button */}
              <div className="lg:hidden flex justify-between items-center mb-6 pb-4 border-b">
                <h3 className="text-xl font-bold">Filters</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <ProductFilters
                categories={categories}
                animes={animes}
                selectedCategory={selectedCategory}
                selectedAnime={selectedAnime}
                priceRange={priceRange}
                searchQuery={searchQuery}
                onCategoryChange={(category) => {
                  setSelectedCategory(category);
                  setMobileFiltersOpen(false);
                  window.history.pushState(null, '', `/productspage/${category.slug}`);
                }}
                onAnimeChange={(anime) => {
                  setSelectedAnime(anime);
                  setMobileFiltersOpen(false);
                }}
                onPriceRangeChange={(range) => {
                  setPriceRange(range);
                }}
                onSearchChange={setSearchQuery}
                onClearAll={handleClearFilters}
              />
            </aside>

            {/* Products Grid */}
            <main className="flex-1 ">
              <ProductGrid
                selectedCategory={selectedCategory}
                selectedAnime={selectedAnime}
                priceRange={priceRange}
                searchQuery={searchQuery}
                onFilterToggle={handleFilterToggle}
                onClearFilters={handleClearFilters}
              />
            </main>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-32 border-t border-gray-200 py-20 bg-gray-50">
          <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-8">
                <div className="w-16 h-0.5 bg-black mx-auto mb-6"></div>
              </div>
              <h3 className="font-display text-5xl font-bold mb-4 tracking-tight">
                ANIME VAULT
              </h3>
              <p className="text-gray-500 tracking-[0.3em] text-xs mb-12">
                CURATED PREMIUM COLLECTIBLES
              </p>
              <div className="flex items-center justify-center space-x-4 mb-12 opacity-30">
                <div className="w-16 h-px bg-black"></div>
                <div className="w-2 h-2 bg-black rotate-45"></div>
                <div className="w-16 h-px bg-black"></div>
              </div>
              <p className="text-gray-400 text-[10px] tracking-[0.2em]">
                © 2024 ANIME VAULT. ALL RIGHTS RESERVED.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Mobile Overlay */}
      {mobileFiltersOpen && (
        <div
          onClick={() => setMobileFiltersOpen(false)}
          className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-sm"
        />
      )}
    </div>
  );
}