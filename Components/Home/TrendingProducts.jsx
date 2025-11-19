'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TrendingCard from './TrendingCard';
import Link from 'next/link';
import { getTrendingProducts } from '@/lib/api/productsApi';

gsap.registerPlugin(ScrollTrigger);

export default function TrendingProducts({ initialProducts = [] }) {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const lineRef = useRef(null);
  const scrollTrackRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef(0);
  const scrollStartRef = useRef(0);
  
  // State for products
  const [products, setProducts] = useState(initialProducts);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch products on mount if no initial products
  useEffect(() => {
    if (initialProducts.length === 0) {
      fetchProducts();
    }
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getTrendingProducts({
        limit: 6,
        page: 1,
        sortBy: 'trending'
      });

      if (response.success) {
        
        setProducts(response.data.products);
      } else {
        setError(response.message);
      }
    } catch (err) {
      setError('Failed to load trending products');
      console.error('Failed to fetch products:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (products.length === 0) return;

    const ctx = gsap.context(() => {
      // Header entrance
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
          }
        }
      );

      // Line draw
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
          delay: 0.3
        }
      );

      // Cards entrance
      gsap.fromTo(
        '.trending-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: scrollContainerRef.current,
            start: 'top 85%',
          }
        }
      );
    });

    return () => ctx.revert();
  }, [products]);

  const updateScrollProgress = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollWidth = container.scrollWidth - container.clientWidth;
    const progress = scrollWidth > 0 ? (container.scrollLeft / scrollWidth) * 100 : 0;
    setScrollProgress(Math.min(100, Math.max(0, progress)));
  };

  const smoothScrollTo = (targetScroll) => {
    gsap.to(scrollContainerRef.current, {
      scrollLeft: targetScroll,
      duration: 1,
      ease: 'power3.out'
    });
  };

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cardWidth = container.querySelector('.trending-card')?.offsetWidth || 400;
    const gap = 32;
    const scrollAmount = cardWidth + gap;
    
    const targetScroll = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;

    smoothScrollTo(targetScroll);
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragStartRef.current = e.pageX;
    scrollStartRef.current = scrollContainerRef.current.scrollLeft;
    scrollContainerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const delta = e.pageX - dragStartRef.current;
    scrollContainerRef.current.scrollLeft = scrollStartRef.current - delta;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grab';
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress();

    return () => container.removeEventListener('scroll', updateScrollProgress);
  }, [products]);

  const canScrollLeft = scrollProgress > 0;
  const canScrollRight = scrollProgress < 100;

  // Loading state
  if (isLoading && products.length === 0) {
    return (
      <section className="relative py-10 md:py-15 lg:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
              <p className="text-sm text-black/50 tracking-wider uppercase">Loading Trending Products...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="relative py-10 md:py-15 lg:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-black/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-light mb-2">Oops! Something went wrong</h3>
            <p className="text-black/50 mb-6">{error}</p>
            <button 
              onClick={fetchProducts}
              className="group inline-flex items-center gap-3 px-8 py-3 border border-black hover:bg-black hover:text-white transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="text-sm font-medium tracking-wider uppercase">Try Again</span>
            </button>
          </div>
        </div>
      </section>
    );
  }

  // No products state
  if (products.length === 0) {
    return (
      <section className="relative py-10 md:py-15 lg:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-black/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <h3 className="text-xl font-light mb-2">No Products Yet</h3>
            <p className="text-black/50">Check back soon for trending products!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      ref={sectionRef}
      className="relative py-10 md:py-15 lg:py-20 bg-white overflow-hidden select-none"
    >
      {/* Header */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 mb-12 md:mb-16">
        <div 
          ref={headerRef}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-12"
        >
          {/* Title Section */}
          <div className="flex-1">
            <div className="mb-4">
              <span className="text-xs tracking-[0.3em] uppercase font-medium text-black/50">
                What's Hot
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight tracking-tight leading-none mb-6">
              Trending Now
            </h2>
            
            {/* Decorative Line */}
            <div 
              ref={lineRef}
              className="w-20 h-px bg-black"
              style={{ transformOrigin: 'left' }}
            />
          </div>

          {/* Navigation Controls - Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            <button 
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`group w-14 h-14 border border-black flex items-center justify-center transition-all duration-300 ${
                canScrollLeft 
                  ? 'hover:bg-black hover:border-black cursor-pointer' 
                  : 'opacity-20 cursor-not-allowed'
              }`}
              aria-label="Previous"
            >
              <svg className={`w-6 h-6 transition-colors ${canScrollLeft ? 'group-hover:text-white' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`group w-14 h-14 border border-black flex items-center justify-center transition-all duration-300 ${
                canScrollRight 
                  ? 'hover:bg-black hover:border-black cursor-pointer' 
                  : 'opacity-20 cursor-not-allowed'
              }`}
              aria-label="Next"
            >
              <svg className={`w-6 h-6 transition-colors ${canScrollRight ? 'group-hover:text-white' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Track - Desktop */}
        <div className="hidden lg:block mt-8">
          <div 
            ref={scrollTrackRef}
            className="relative h-px bg-black/10"
          >
            <div 
              className="absolute left-0 top-0 h-full bg-black transition-all duration-300"
              style={{ width: `${scrollProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Scroll Container */}
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="flex gap-6 lg:gap-8 px-4 md:px-6 lg:px-8 pb-2">
            {products.map((product, index) => (
              <div 
                key={product._id || product.id} 
                className="trending-card w-[85vw] sm:w-[70vw] md:w-[55vw] lg:w-[40vw] xl:w-[35vw] flex-shrink-0"
              >
                <TrendingCard product={product} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* Gradient Overlays - Desktop */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="hidden lg:block absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent pointer-events-none" />
      </div>

      {/* Mobile Controls */}
      <div className="lg:hidden container mx-auto px-4 md:px-6 mt-8">
        {/* Progress Bar */}
        <div className="relative h-1 bg-black/10 mb-4">
          <div 
            className="absolute left-0 top-0 h-full bg-black transition-all duration-300"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={`flex items-center gap-2 px-4 py-2 border border-black transition-all ${
              canScrollLeft 
                ? 'hover:bg-black hover:text-white' 
                : 'opacity-20 cursor-not-allowed'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-xs font-medium tracking-wider uppercase">Prev</span>
          </button>
          
          <span className="text-xs text-black/50 font-medium tracking-wider uppercase">
            Swipe or Drag
          </span>

          <button 
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={`flex items-center gap-2 px-4 py-2 border border-black transition-all ${
              canScrollRight 
                ? 'hover:bg-black hover:text-white' 
                : 'opacity-20 cursor-not-allowed'
            }`}
          >
            <span className="text-xs font-medium tracking-wider uppercase">Next</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 mt-16 md:mt-20 lg:mt-24">
        <div className="text-center">
          <Link
            href="/productspage/trending"
            className="group relative cursor-pointer inline-flex items-center gap-4 px-10 lg:px-14 py-4 lg:py-5 border border-black overflow-hidden transition-colors duration-300 hover:text-white"
          >
            <span className="relative z-10 text-sm font-medium tracking-[0.2em] uppercase">
              Explore All Products
            </span>
            <svg 
              className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </Link>
        </div>
      </div>
    </section>
  );
}