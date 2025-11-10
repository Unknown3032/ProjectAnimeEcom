'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { featuredProducts } from '@/lib/featuerdProductData';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedProducts() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
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
            start: 'top 80%',
          }
        }
      );

      // Cards animation
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, x: 40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: scrollContainerRef.current,
            start: 'top 80%',
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const smoothScrollTo = (direction) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = 400;
    const targetScroll = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;

    gsap.to(container, {
      scrollLeft: targetScroll,
      duration: 0.8,
      ease: 'power2.out'
    });
  };

  const ProductCard = ({ product, index }) => {
    const cardRef = useRef(null);
    const imageRef = useRef(null);

    const handleMouseEnter = () => {
      gsap.to(imageRef.current, {
        scale: 1.04,
        duration: 0.6,
        ease: 'power2.out'
      });

      gsap.to(cardRef.current, {
        y: -3,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.6,
        ease: 'power2.out'
      });

      gsap.to(cardRef.current, {
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const discount = product.originalPrice 
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

    return (
      <div
        ref={(el) => {
          cardRef.current = el;
          cardsRef.current[index] = el;
        }}
        className="shrink-0 w-[280px] sm:w-[320px] md:w-[360px] cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image */}
        <div className="relative h-[400px] sm:h-[450px] md:h-[500px] overflow-hidden bg-gray-50 mb-5">
          <img
            ref={imageRef}
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          
          {/* Badge */}
          {product.badge && (
            <div className="absolute top-4 right-4 px-3 py-1.5 bg-black text-white text-xs font-medium tracking-wider uppercase">
              {product.badge}
            </div>
          )}

          {/* Discount */}
          {discount > 0 && (
            <div className="absolute top-16 right-4 px-3 py-1.5 bg-white text-black text-xs font-bold">
              -{discount}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-1">
          {/* Category */}
          <span className="block text-xs tracking-[0.25em] uppercase mb-3 text-black/35 font-medium">
            {product.category}
          </span>

          {/* Name */}
          <h3 className="text-lg sm:text-xl font-light mb-4 leading-tight line-clamp-2">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="text-2xl sm:text-3xl font-light">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-base text-black/40 line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <button className="w-full py-3 bg-black text-white text-xs font-medium tracking-[0.15em] uppercase hover:bg-black/90 transition-colors duration-300">
            Add to Cart
          </button>
        </div>
      </div>
    );
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-10 md:py-15 lg:py-20 bg-white overflow-hidden"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div 
          ref={headerRef}
          className="flex items-end justify-between mb-12 md:mb-16"
        >
          <div>
            <span className="block text-xs tracking-[0.35em] uppercase mb-4 text-black/35">
              Curated Selection
            </span>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight">
              Featured
            </h2>
          </div>

          {/* Navigation - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={() => smoothScrollTo('left')}
              className="w-12 h-12 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-300"
              aria-label="Previous"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => smoothScrollTo('right')}
              className="w-12 h-12 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-300"
              aria-label="Next"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Horizontal Scroll */}
        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto overflow-y-hidden scrollbar-hide scroll-smooth pb-4"
          >
            <div className="flex gap-6 md:gap-8">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>

        
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex justify-center gap-3 mt-8">
          <button 
            onClick={() => smoothScrollTo('left')}
            className="w-10 h-10 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
            aria-label="Previous"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={() => smoothScrollTo('right')}
            className="w-10 h-10 border border-black/20 flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300"
            aria-label="Next"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}