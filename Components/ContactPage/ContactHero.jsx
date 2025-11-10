'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function ContactHero() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const lineRef = useRef(null);
  const floatingRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.fromTo(
        lineRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: 'power2.out' }
      )
      .fromTo(
        titleRef.current,
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo(
        subtitleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
        '-=0.8'
      );

      // Floating elements
      floatingRefs.current.forEach((el, index) => {
        if (!el) return;
        
        gsap.to(el, {
          y: index % 2 === 0 ? -30 : 30,
          x: index % 2 === 0 ? 20 : -20,
          duration: 4 + index,
          repeat: -1,
          yoyo: true,
          ease: 'power1.inOut',
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="relative min-h-[70vh] bg-white flex items-center overflow-hidden">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            ref={(el) => (floatingRefs.current[i] = el)}
            className="absolute border border-black/5"
            style={{
              width: `${150 + i * 50}px`,
              height: `${150 + i * 50}px`,
              borderRadius: i % 2 === 0 ? '50%' : '0%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-16 py-20 w-full">
        <div className="max-w-4xl mx-auto text-center">
          
          <div 
            ref={lineRef}
            className="w-20 h-px bg-black mb-8 mx-auto origin-left"
          />

          <div className="overflow-hidden mb-6">
            <h1
              ref={titleRef}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-black"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: '400',
                letterSpacing: '-0.02em',
                lineHeight: '1.1',
              }}
            >
              Get in Touch
            </h1>
          </div>

          <div className="overflow-hidden">
            <p
              ref={subtitleRef}
              className="text-base sm:text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: '300',
                lineHeight: '1.7',
              }}
            >
              Have a question about our products? We'd love to hear from you. 
              Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Border with Animation */}
      <div className="absolute bottom-0 start-0 w-full h-px bg-black/10 animate-pulse-border" />
    </div>
  );
}