'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function AboutHero() {
  const heroRef = useRef(null);
  const linesRef = useRef([]);
  const imageRef = useRef(null);
  const decorRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.3 });

      // Animate decorative line
      tl.fromTo(
        decorRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 1, ease: 'power2.out' }
      );

      // Animate text lines
      linesRef.current.forEach((line, index) => {
        if (!line) return;
        tl.fromTo(
          line,
          { y: 100, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 1.2, 
            ease: 'power4.out' 
          },
          index === 0 ? '-=0.6' : '-=0.9'
        );
      });

      // Animate image
      tl.fromTo(
        imageRef.current,
        { scale: 1.1, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out' },
        '-=1'
      );

      // Floating animation for image
      gsap.to(imageRef.current, {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="relative min-h-screen bg-white text-black overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 start-0 w-full h-px bg-black/5" />
      <div className="absolute bottom-0 start-0 w-full h-px bg-black/5" />
      
      <div className="relative z-10 max-w-screen-2xl mx-auto px-8 lg:px-20 min-h-screen flex items-center">
        <div className="grid lg:grid-cols-2 gap-16 items-center w-full py-20">
          {/* Left Content */}
          <div className="space-y-8">
            <div 
              ref={decorRef}
              className="w-24 h-px bg-black origin-left"
            />

            <div className="space-y-6">
              <div className="reveal-text">
                <h1
                  ref={(el) => (linesRef.current[0] = el)}
                  className="text-7xl md:text-8xl lg:text-9xl text-black"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: '400',
                    letterSpacing: '-0.02em',
                    lineHeight: '0.9',
                  }}
                >
                  About Us
                </h1>
              </div>

              <div className="reveal-text">
                <p
                  ref={(el) => (linesRef.current[1] = el)}
                  className="text-xl md:text-2xl text-zinc-600 leading-relaxed"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '300',
                    letterSpacing: '0.01em',
                  }}
                >
                  Connecting anime enthusiasts worldwide through thoughtfully
                  curated gifts that celebrate the stories we love.
                </p>
              </div>

              <div className="reveal-text">
                <div
                  ref={(el) => (linesRef.current[2] = el)}
                  className="pt-6"
                >
                  <button className="group relative px-10 py-5 overflow-hidden border border-black">
                    <span
                      className="relative z-10 text-[11px] uppercase text-black group-hover:text-white transition-colors duration-500"
                      style={{ letterSpacing: '0.3em' }}
                    >
                      our story
                    </span>
                    <div className="absolute inset-0 bg-black scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div 
              ref={imageRef}
              className="relative aspect-[3/4] overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&h=1000&fit=crop&q=90"
                alt="About"
                className="size-full object-cover"
                style={{ filter: 'grayscale(100%)' }}
              />
              <div className="absolute inset-0 border-2 border-black/10" />
            </div>
            
            {/* Decorative corners */}
            <div className="absolute -top-4 -start-4 w-16 h-16 border-t-2 border-l-2 border-black/20" />
            <div className="absolute -bottom-4 -end-4 w-16 h-16 border-b-2 border-r-2 border-black/20" />
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-12 start-1/2 -translate-x-1/2 z-20">
        <div className="flex flex-col items-center gap-3 animate-bounce">
          <span
            className="text-[10px] uppercase text-zinc-400"
            style={{ letterSpacing: '0.3em' }}
          >
            scroll
          </span>
          <div className="w-px h-16 bg-gradient-to-b from-black/40 to-transparent" />
        </div>
      </div>
    </div>
  );
}