'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, viewMode, onLoadMore, hasMore, isLoading }) {
  const gridRef = useRef(null);
  const loaderRef = useRef(null);
  const prevCountRef = useRef(0);

  // Initial load animation - only once
  useEffect(() => {
    if (prevCountRef.current === 0 && products.length > 0) {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          '.product-card',
          { 
            opacity: 0, 
            y: 20,
          },
          { 
            opacity: 1, 
            y: 0,
            duration: 0.4,
            stagger: 0.03,
            ease: 'power2.out',
          }
        );
      }, gridRef);

      prevCountRef.current = products.length;
      return () => ctx.revert();
    }
  }, [products.length]);

  // Minimal animation for newly loaded products only
  useEffect(() => {
    if (prevCountRef.current > 0 && products.length > prevCountRef.current) {
      const newProducts = products.length - prevCountRef.current;
      const productCards = gridRef.current?.querySelectorAll('.product-card');
      
      if (productCards) {
        const newCards = Array.from(productCards).slice(-newProducts);
        
        gsap.fromTo(
          newCards,
          { 
            opacity: 0,
          },
          { 
            opacity: 1,
            duration: 0.3,
            ease: 'power1.out',
          }
        );
      }
      
      prevCountRef.current = products.length;
    }
  }, [products.length]);

  // Infinite scroll observer
  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, isLoading, onLoadMore]);

  return (
    <>
      <div 
        ref={gridRef}
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8'
            : 'flex flex-col gap-4 sm:gap-6'
        }
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} viewMode={viewMode} />
        ))}
      </div>

      {/* Infinite Scroll Loader */}
      {hasMore && (
        <div 
          ref={loaderRef}
          className="flex items-center justify-center py-12"
        >
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="w-10 h-10 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
              <span className="text-sm font-medium text-gray-600">Loading...</span>
            </div>
          ) : (
            <div className="h-12" />
          )}
        </div>
      )}
    </>
  );
}