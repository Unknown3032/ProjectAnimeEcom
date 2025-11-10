'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function ProductBanner({ categoryData, productCount }) {
  const bannerRef = useRef(null);
  const overlayRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const lineRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Overlay animation
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power2.out' }
      );

      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 40 },
        { 
          opacity: 1, 
          y: 0,
          duration: 1, 
          ease: 'power3.out',
          delay: 0.3
        }
      );

      // Description animation
      gsap.fromTo(
        descRef.current,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.5
        }
      );

      // Line animation
      gsap.fromTo(
        lineRef.current,
        { scaleX: 0 },
        { 
          scaleX: 1,
          duration: 0.8,
          ease: 'power2.out',
          delay: 0.7
        }
      );

      // Stats animation
      gsap.fromTo(
        statsRef.current,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.9
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div 
      ref={bannerRef}
      className="relative h-[65vh] md:h-[75vh] lg:h-[80vh] overflow-hidden bg-white"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={categoryData.bannerImage}
          alt={categoryData.name}
          className="w-full h-full object-cover opacity-70"
        />
      </div>

      {/* White Gradient Overlay */}
      

      {/* Content */}
      <div className="relative h-full flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            {/* Title */}
            <div ref={titleRef}>
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-light mb-6 md:mb-8 tracking-tight uppercase">
                {categoryData.name}
              </h1>
            </div>

            {/* Decorative Line */}
            <div 
              ref={lineRef}
              className="w-24 h-px bg-white mx-auto mb-6 md:mb-8"
              style={{ transformOrigin: 'center' }}
            />

            {/* Description */}
            <p 
              ref={descRef}
              className="text-lg md:text-2xl font-light mb-8 md:mb-12 text-white/80 tracking-wide"
            >
              {categoryData.description}
            </p>

            {/* Stats */}
            <div 
              ref={statsRef}
              className="text-sm md:text-base font-medium tracking-widest uppercase text-white/70"
            >
              {productCount} Products Available
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}