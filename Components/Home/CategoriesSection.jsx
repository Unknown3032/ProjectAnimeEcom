'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { categories } from '@/lib/categoriesData';

gsap.registerPlugin(ScrollTrigger);

export default function CategoriesSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
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
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );

      // Cards entrance animation
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { 
            opacity: 0,
            y: 40
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
            },
            delay: index * 0.1
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  const CategoryFloatingCard = ({ category, index }) => {
    const cardRef = useRef(null);
    const imageRef = useRef(null);
    const contentRef = useRef(null);
    const overlayRef = useRef(null);
    const numberRef = useRef(null);

    const handleMouseEnter = () => {
      // Smooth image zoom
      gsap.to(imageRef.current, {
        scale: 1.05,
        duration: 0.7,
        ease: 'power2.out'
      });

      // Overlay fade
      gsap.to(overlayRef.current, {
        opacity: 0.05,
        duration: 0.5,
        ease: 'power2.out'
      });

      // Content lift
      gsap.to(contentRef.current, {
        y: -5,
        duration: 0.4,
        ease: 'power2.out'
      });

      // Number fade
      gsap.to(numberRef.current, {
        opacity: 0.1,
        duration: 0.4,
        ease: 'power2.out'
      });

      // Card elevation
      gsap.to(cardRef.current, {
        y: -8,
        duration: 0.5,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.7,
        ease: 'power2.out'
      });

      gsap.to(overlayRef.current, {
        opacity: 0.15,
        duration: 0.5,
        ease: 'power2.out'
      });

      gsap.to(contentRef.current, {
        y: 0,
        duration: 0.4,
        ease: 'power2.out'
      });

      gsap.to(numberRef.current, {
        opacity: 0.3,
        duration: 0.4,
        ease: 'power2.out'
      });

      gsap.to(cardRef.current, {
        y: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    };

    return (
      <div
        ref={(el) => {
          cardRef.current = el;
          cardsRef.current[index] = el;
        }}
        className="group cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative bg-white border border-black/5 overflow-hidden">
          {/* Image Container */}
          <div className="relative h-72 md:h-80 lg:h-96 overflow-hidden bg-gray-50">
            <img
              ref={imageRef}
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover"
            />
            
            {/* White Overlay */}
            <div
              ref={overlayRef}
              className="absolute inset-0 bg-white opacity-15"
            />

            {/* Large Number Watermark */}
            <div 
              ref={numberRef}
              className="absolute top-6 right-6 text-8xl md:text-9xl font-extralight leading-none opacity-30 pointer-events-none"
              style={{ 
                WebkitTextStroke: '1px rgba(0,0,0,0.1)',
                color: 'transparent'
              }}
            >
              {String(index + 1).padStart(2, '0')}
            </div>
          </div>

          {/* Content */}
          <div 
            ref={contentRef}
            className="p-6 md:p-8 bg-white"
          >
            {/* Small Number & Count */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs tracking-[0.3em] uppercase font-medium text-black/30">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="text-xs font-light text-black/40">
                {category.count} products
              </span>
            </div>

            {/* Category Name */}
            <h3 className="text-3xl md:text-4xl font-extralight mb-3 tracking-tight leading-none">
              {category.name}
            </h3>

            {/* Tagline */}
            <p className="text-sm md:text-base font-light text-black/60 mb-6">
              {category.tagline}
            </p>

            {/* Explore Link */}
            <div className="flex items-center gap-3 text-sm font-medium tracking-wider uppercase group-hover:gap-5 transition-all duration-300">
              <span>Explore</span>
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-10 md:py-15 lg:py-20 bg-white overflow-hidden"
    >
      {/* Subtle Background */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, black 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div 
          ref={headerRef}
          className="max-w-4xl mx-auto text-center mb-16 md:mb-20 lg:mb-24"
        >
          <div className="mb-6">
            <span className="text-xs tracking-[0.4em] uppercase font-medium text-black/40">
              Shop by Category
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-tight leading-none mb-8">
            Collections
          </h2>

          <div className="w-20 h-px bg-black mx-auto mb-8" />

          <p className="text-base md:text-lg font-light text-black/60 max-w-2xl mx-auto">
            Explore our carefully curated categories and find your perfect anime merchandise
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 max-w-7xl mx-auto">
          {categories.map((category, index) => (
            <CategoryFloatingCard 
              key={category.id} 
              category={category} 
              index={index}
            />
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-16 md:mt-20">
          <button className="group inline-flex items-center gap-4 px-10 md:px-12 py-4 md:py-5 border border-black overflow-hidden relative hover:text-white transition-colors duration-500">
            <span className="relative z-10 text-sm font-medium tracking-[0.2em] uppercase">
              View All Products
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
          </button>
        </div>
      </div>
    </section>
  );
}