'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactMap() {
  const mapRef = useRef(null);
  const overlayRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: mapRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, mapRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={mapRef} className="relative bg-white py-20 lg:py-32">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-16">
        
        {/* Map Container */}
        <div className="relative aspect-[16/9] lg:aspect-[21/9] bg-zinc-100 border border-black/10 overflow-hidden">
          
          {/* Placeholder Map - Replace with actual map integration */}
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-200 to-zinc-100 flex items-center justify-center">
            <div className="text-center">
              <svg className="size-20 mx-auto mb-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-sm text-zinc-500">Map Integration</p>
            </div>
          </div>

          {/* Overlay Card */}
          <div 
            ref={overlayRef}
            className="absolute bottom-8 start-8 bg-white p-8 border border-black/10 shadow-2xl max-w-sm"
          >
            <h3
              className="text-2xl mb-4"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: '500',
              }}
            >
              Visit Our Store
            </h3>

            <div className="space-y-3 text-sm text-zinc-700">
              <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: '300' }}>
                123 Anime Street<br />
                Shibuya, Tokyo 150-0002<br />
                Japan
              </p>

              <div className="pt-4 border-t border-zinc-200">
                <p className="text-xs uppercase text-zinc-500 mb-2" style={{ letterSpacing: '0.1em' }}>
                  Store Hours
                </p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontWeight: '300' }}>
                  Monday - Sunday<br />
                  10:00 AM - 8:00 PM
                </p>
              </div>

              <button className="mt-6 w-full px-6 py-3 bg-black text-white text-sm uppercase hover:bg-zinc-800 transition-colors duration-300"
                style={{ letterSpacing: '0.1em' }}
              >
                Get Directions
              </button>
            </div>
          </div>

          {/* Animated Grid Overlay */}
          <div 
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(black 1px, transparent 1px),
                linear-gradient(90deg, black 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        </div>
      </div>
    </div>
  );
}