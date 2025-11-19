'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

export default function CategoryBanner({ category }) {
  const bannerRef = useRef(null);
  const imageRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reset animations
      gsap.set(imageRef.current, { scale: 1.2, opacity: 0 });
      gsap.set(overlayRef.current, { opacity: 0 });
      gsap.set(lineRef.current, { scaleX: 0 });
      gsap.set(titleRef.current, { y: 50, opacity: 0 });
      gsap.set(descRef.current, { y: 30, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      tl.to(imageRef.current, {
        scale: 1,
        opacity: 1,
        duration: 1.6,
      })
      .to(overlayRef.current, {
        opacity: 1,
        duration: 1,
      }, '-=1.4')
      .to(lineRef.current, {
        scaleX: 1,
        duration: 1.2,
      }, '-=1.2')
      .to(titleRef.current, {
        y: 0,
        opacity: 1,
        duration: 1.2,
      }, '-=1')
      .to(descRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
      }, '-=0.9');

    }, bannerRef);

    return () => ctx.revert();
  }, [category]);

  if (category.id === 'all') return null;

  return (
    <div
      ref={bannerRef}
      className="relative overflow-hidden mb-20 h-[400px] md:h-[500px] bg-gray-50"
    >
      {/* Background Image - No Grayscale */}
      <div className="absolute inset-0" ref={imageRef}>
        <Image
          src={category.image}
          alt={category.name}
          fill
          className="object-cover"
          priority
          quality={90}
        />
      </div>

      {/* Gradient Overlay */}
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/70 to-transparent"
      ></div>

      {/* Content */}
      <div ref={contentRef} className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-8 md:px-16 w-full">
          <div 
            ref={lineRef} 
            className="w-20 h-0.5 bg-black mb-8"
            style={{ transformOrigin: 'left' }}
          ></div>
          
          <div ref={titleRef}>
            <h2 className="font-display text-6xl md:text-8xl font-bold mb-4 tracking-tight text-black">
              {category.name}
            </h2>
          </div>
          
          <div ref={descRef}>
            <p className="text-lg md:text-2xl text-gray-700 font-light tracking-wide max-w-xl">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      {/* Decorative corner frame */}
      <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-black/20"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-black/20"></div>
    </div>
  );
}