'use client';

import { useRef } from 'react';
import gsap from 'gsap';

export default function CategoryCard({ category, layout = 'default' }) {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const lineRef = useRef(null);

  const handleMouseEnter = () => {
    gsap.to(imageRef.current, {
      scale: 1.08,
      duration: 0.8,
      ease: 'power2.out'
    });

    gsap.to(overlayRef.current, {
      opacity: 0.1,
      duration: 0.5,
      ease: 'power2.out'
    });

    gsap.to(lineRef.current, {
      scaleX: 1,
      duration: 0.4,
      ease: 'power2.out'
    });

    gsap.to(contentRef.current, {
      y: -8,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.8,
      ease: 'power2.out'
    });

    gsap.to(overlayRef.current, {
      opacity: 0.25,
      duration: 0.5,
      ease: 'power2.out'
    });

    gsap.to(lineRef.current, {
      scaleX: 0,
      duration: 0.4,
      ease: 'power2.out'
    });

    gsap.to(contentRef.current, {
      y: 0,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  return (
    <div
      ref={cardRef}
      className="group relative overflow-hidden bg-white cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ 
        height: layout === 'large' ? '600px' : '500px' 
      }}
    >
      {/* Image */}
      <div className="absolute inset-0">
        <img
          ref={imageRef}
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* White Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-white opacity-25"
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="absolute inset-x-0 bottom-0 p-6 md:p-8 bg-gradient-to-t from-white via-white/95 to-transparent"
      >
        <div className="mb-3">
          <span className="text-xs tracking-[0.25em] uppercase font-medium text-black/50">
            {category.count} Items
          </span>
        </div>

        <h3 className="text-3xl md:text-4xl lg:text-5xl font-extralight mb-3 leading-tight">
          {category.name}
        </h3>

        <p className="text-sm md:text-base font-light text-black/70 mb-4">
          {category.description}
        </p>

        {/* Animated Line */}
        <div 
          ref={lineRef}
          className="w-16 h-px bg-black origin-left"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      {/* Border */}
      <div className="absolute inset-0 border border-black/10 group-hover:border-black/30 transition-colors duration-300 pointer-events-none" />
    </div>
  );
}