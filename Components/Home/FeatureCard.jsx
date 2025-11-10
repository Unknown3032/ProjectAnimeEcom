'use client';

import { useRef } from 'react';
import gsap from 'gsap';

export default function FeatureCard({ feature, index }) {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const numberRef = useRef(null);
  const iconRef = useRef(null);

  const handleMouseEnter = () => {
    gsap.to(imageRef.current, {
      scale: 1.1,
      duration: 0.8,
      ease: 'power2.out'
    });

    gsap.to(overlayRef.current, {
      opacity: 0.15,
      duration: 0.5,
      ease: 'power2.out'
    });

    gsap.to(numberRef.current, {
      y: -10,
      opacity: 0.3,
      duration: 0.4,
      ease: 'power2.out'
    });

    gsap.to(iconRef.current, {
      scale: 1.1,
      rotate: 5,
      duration: 0.4,
      ease: 'back.out(1.7)'
    });

    gsap.to(contentRef.current, {
      y: -5,
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

    gsap.to(numberRef.current, {
      y: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    });

    gsap.to(iconRef.current, {
      scale: 1,
      rotate: 0,
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
      className="group relative h-[500px] md:h-[550px] lg:h-[600px] overflow-hidden bg-white cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          ref={imageRef}
          src={feature.image}
          alt={feature.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* White Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-white opacity-25"
      />

      {/* Large Number Background */}
      <div
        ref={numberRef}
        className="absolute top-8 left-8 text-[12rem] md:text-[14rem] lg:text-[16rem] font-extralight leading-none opacity-100 pointer-events-none"
        style={{ 
          WebkitTextStroke: '1px rgba(0,0,0,0.1)',
          color: 'transparent'
        }}
      >
        {feature.number}
      </div>

      {/* Icon */}
      <div className="absolute top-8 right-8">
        <div
          ref={iconRef}
          className="w-16 h-16 md:w-20 md:h-20 text-black/80"
        >
          {feature.icon}
        </div>
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="absolute inset-x-0 bottom-0 p-8 md:p-10 lg:p-12 bg-gradient-to-t from-white via-white to-transparent"
      >
        <div className="mb-3">
          <span className="text-xs tracking-[0.3em] uppercase font-medium text-black/50">
            {feature.number}
          </span>
        </div>

        <h3 className="text-3xl md:text-4xl lg:text-5xl font-extralight mb-4 md:mb-6 leading-tight">
          {feature.title}
        </h3>

        <p className="text-sm md:text-base font-light leading-relaxed text-black/70 max-w-md">
          {feature.description}
        </p>
      </div>

      {/* Border on Hover */}
      <div className="absolute inset-0 border border-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}