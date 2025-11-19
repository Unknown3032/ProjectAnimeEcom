'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function HeroBanner() {
  const bannerRef = useRef(null);
  const titleLine1Ref = useRef(null);
  const titleLine2Ref = useRef(null);
  const subtitleRef = useRef(null);
  const decorLine1Ref = useRef(null);
  const decorLine2Ref = useRef(null);
  const decorCircleRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([titleLine1Ref.current, titleLine2Ref.current], {
        yPercent: 100,
        opacity: 0,
      });
      
      gsap.set(subtitleRef.current, {
        y: 30,
        opacity: 0,
      });

      gsap.set([decorLine1Ref.current, decorLine2Ref.current], {
        scaleX: 0,
      });

      gsap.set(decorCircleRef.current, {
        scale: 0,
        rotation: -180,
      });

      // Animation timeline
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

      tl.to(decorLine1Ref.current, {
        scaleX: 1,
        duration: 1.4,
      })
      .to(titleLine1Ref.current, {
        yPercent: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'expo.out',
      }, '-=1')
      .to(titleLine2Ref.current, {
        yPercent: 0,
        opacity: 1,
        duration: 1.2,
        ease: 'expo.out',
      }, '-=0.9')
      .to(subtitleRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
      }, '-=0.8')
      .to(decorLine2Ref.current, {
        scaleX: 1,
        duration: 1.2,
      }, '-=0.9')
      .to(decorCircleRef.current, {
        scale: 1,
        rotation: 0,
        duration: 1.4,
        ease: 'back.out(1.4)',
      }, '-=1');

    }, bannerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={bannerRef} className="relative overflow-hidden mb-24 pt-10 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-64 h-64 border border-gray-200 rounded-full opacity-30" 
          ref={decorCircleRef}
          style={{ transformOrigin: 'center' }}
        ></div>
        
        {/* Top decorative line */}
        <div className="mb-16 flex items-center justify-center">
          <div 
            ref={decorLine1Ref} 
            className="h-px bg-gradient-to-r from-transparent via-black to-transparent w-full max-w-md"
            style={{ transformOrigin: 'left' }}
          ></div>
        </div>
        
        {/* Main title */}
        <div className="text-center mb-8 overflow-hidden">
          <div className="overflow-hidden mb-2">
            <h1 
              ref={titleLine1Ref}
              className="font-display text-7xl md:text-9xl lg:text-[12rem] font-bold tracking-tighter leading-none"
            >
              ANIME
            </h1>
          </div>
          <div className="overflow-hidden">
            <h1 
              ref={titleLine2Ref}
              className="font-display text-7xl md:text-9xl lg:text-[12rem] font-bold tracking-tighter leading-none"
              style={{
                WebkitTextStroke: '2px black',
                WebkitTextFillColor: 'transparent',
              }}
            >
              VAULT
            </h1>
          </div>
        </div>

        {/* Subtitle */}
        <p 
          ref={subtitleRef} 
          className="text-center text-base md:text-xl text-gray-600 font-light tracking-[0.3em] mb-16"
        >
          CURATED PREMIUM COLLECTIBLES
        </p>

        {/* Bottom decorative line */}
        <div className="flex items-center justify-center">
          <div 
            ref={decorLine2Ref} 
            className="h-px bg-gradient-to-r from-transparent via-black to-transparent w-full max-w-md"
            style={{ transformOrigin: 'right' }}
          ></div>
        </div>
      </div>
    </div>
  );
}