'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function TeamSection() {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      tl.fromTo(
        contentRef.current?.children,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
        }
      )
      .fromTo(
        imageRef.current,
        { scale: 0.8, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: 1.2, 
          ease: 'power2.out' 
        },
        '-=0.8'
      );

      // Floating animation
      gsap.to(imageRef.current, {
        y: -15,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="bg-white text-black py-32">
      <div className="max-w-screen-2xl mx-auto px-8 lg:px-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Image */}
          <div className="relative order-2 lg:order-1">
            <div 
              ref={imageRef}
              className="relative aspect-square overflow-hidden"
            >
              <img
                src="https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&h=800&fit=crop&q=90"
                alt="Team"
                className="size-full object-cover"
                style={{ filter: 'grayscale(100%)' }}
              />
              <div className="absolute inset-0 border-2 border-black/10" />
              
              {/* Decorative overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent" />
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -start-6 w-24 h-24 border-t-2 border-l-2 border-black/10" />
            <div className="absolute -bottom-6 -end-6 w-24 h-24 border-b-2 border-r-2 border-black/10" />
          </div>

          {/* Right - Content */}
          <div ref={contentRef} className="order-1 lg:order-2 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-px bg-black/20" />
              <span
                className="text-[11px] uppercase text-zinc-500"
                style={{ letterSpacing: '0.3em' }}
              >
                join us
              </span>
            </div>

            <h2
              className="text-5xl md:text-6xl lg:text-7xl text-black"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: '400',
                letterSpacing: '-0.02em',
                lineHeight: '1.1',
              }}
            >
              Let's Create Magic Together
            </h2>

            <div className="w-20 h-px bg-black/20" />

            <p
              className="text-lg md:text-xl text-zinc-600 leading-relaxed max-w-xl"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: '300',
              }}
            >
              We're always looking for passionate individuals who share our love
              for anime and want to make a difference in the community. Join our
              team and help shape the future of anime gifting.
            </p>

            <div className="flex gap-4 pt-4">
              <button className="group relative px-10 py-5 overflow-hidden border border-black">
                <span
                  className="relative z-10 text-[11px] uppercase text-black group-hover:text-white transition-colors duration-500"
                  style={{ letterSpacing: '0.3em' }}
                >
                  explore careers
                </span>
                <div className="absolute inset-0 bg-black scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom" />
              </button>

              <button className="group flex items-center gap-3 text-sm text-zinc-600 hover:text-black transition-colors duration-300">
                <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: '300' }}>
                  View openings
                </span>
                <svg 
                  className="size-4 group-hover:translate-x-1 transition-transform duration-300" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-black/10">
              <div>
                <div 
                  className="text-3xl mb-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  Remote
                </div>
                <div className="text-sm text-zinc-600">Work from anywhere</div>
              </div>
              <div>
                <div 
                  className="text-3xl mb-2"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  10+
                </div>
                <div className="text-sm text-zinc-600">Open positions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}