'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import Image from 'next/image';

export default function CategoryCard({ category }) {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  const handleMouseEnter = () => {
    gsap.to(imageRef.current, {
      scale: 1.1,
      duration: 0.6,
      ease: 'power2.out'
    });

    gsap.to(overlayRef.current, {
      opacity: 0.7,
      duration: 0.4,
      ease: 'power2.out'
    });

    gsap.to(contentRef.current, {
      y: -10,
      duration: 0.4,
      ease: 'power2.out'
    });

    gsap.to(cardRef.current, {
      y: -8,
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.6,
      ease: 'power2.out'
    });

    gsap.to(overlayRef.current, {
      opacity: 0.4,
      duration: 0.4,
      ease: 'power2.out'
    });

    gsap.to(contentRef.current, {
      y: 0,
      duration: 0.4,
      ease: 'power2.out'
    });

    gsap.to(cardRef.current, {
      y: 0,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  return (
    <div
      ref={cardRef}
      className="category-card relative h-80 md:h-96 overflow-hidden cursor-pointer bg-white rounded-lg shadow-md group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Image */}
      <div className="absolute inset-0 overflow-hidden">
        <div ref={imageRef} className="w-full h-full">
          <img
            src={category.image}
            alt={category.title}
            className="object-cover grayscale"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      </div>

      {/* Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black opacity-40 transition-opacity"
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white z-10"
      >
        {/* Item Count Badge */}
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-white text-black text-xs font-medium rounded-full">
            {category.itemCount} items
          </span>
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold mb-2 tracking-tight">
          {category.title}
        </h2>

        {/* Description */}
        <p className="text-sm md:text-base text-gray-200 font-light mb-4">
          {category.description}
        </p>

        {/* Arrow Icon */}
        <div className="flex items-center text-sm font-medium group-hover:gap-3 gap-2 transition-all duration-300">
          <span>Explore</span>
          <svg 
            className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Decorative Border */}
      <div className="absolute inset-0 border border-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none rounded-lg" />
    </div>
  );
}