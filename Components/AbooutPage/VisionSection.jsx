'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function VisionSection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const statsRef = useRef([]);

  const values = [
    {
      number: '01',
      title: 'Authenticity',
      description: 'We curate only genuine, officially licensed merchandise that honors the creators and their work.',
    },
    {
      number: '02',
      title: 'Community',
      description: 'Building connections between fans worldwide through shared passion and meaningful exchanges.',
    },
    {
      number: '03',
      title: 'Quality',
      description: 'Every product is carefully selected to ensure it meets our high standards and exceeds expectations.',
    },
    {
      number: '04',
      title: 'Innovation',
      description: 'Constantly evolving our platform to create the best gifting experience for anime enthusiasts.',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current?.children,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Cards animation
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.fromTo(
          card,
          { 
            opacity: 0, 
            y: 100,
            rotateX: -15
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1.2,
            delay: index * 0.15,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Stats animation
      statsRef.current.forEach((stat, index) => {
        if (!stat) return;

        gsap.fromTo(
          stat,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
              trigger: stat,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative bg-zinc-50 text-black py-32 overflow-hidden">
      {/* Decorative background grid */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(black 1px, transparent 1px),
            linear-gradient(90deg, black 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
        }}
      />

      <div className="relative z-10 max-w-screen-2xl mx-auto px-8 lg:px-20">
        {/* Section Title */}
        <div ref={titleRef} className="mb-32 text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-px bg-black/20" />
            <span
              className="text-[11px] uppercase text-zinc-500"
              style={{ letterSpacing: '0.3em' }}
            >
              our vision
            </span>
            <div className="w-12 h-px bg-black/20" />
          </div>
          
          <h2
            className="text-5xl md:text-6xl lg:text-7xl text-black mb-8"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: '400',
              letterSpacing: '-0.02em',
            }}
          >
            Shaping the Future
          </h2>
          
          <p
            className="text-xl md:text-2xl text-zinc-600 leading-relaxed"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: '300',
            }}
          >
            Our vision is to become the world's leading platform for anime
            gifting, where every fan can find the perfect way to express their
            love for their favorite series.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 mb-32">
          {values.map((value, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="group relative bg-white p-10 lg:p-12 border border-black/10 hover:border-black/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Number */}
              <div 
                className="absolute top-6 end-6 text-6xl font-light text-black/5 group-hover:text-black/10 transition-colors duration-500"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {value.number}
              </div>

              <div className="space-y-6 relative z-10">
                <h3
                  className="text-3xl md:text-4xl"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: '500',
                  }}
                >
                  {value.title}
                </h3>
                
                <div className="w-12 h-px bg-black/20 group-hover:w-24 transition-all duration-500" />
                
                <p
                  className="text-zinc-700 leading-relaxed"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '300',
                  }}
                >
                  {value.description}
                </p>

                {/* Arrow icon */}
                <div className="pt-4">
                  <div className="size-10 border border-black/20 flex items-center justify-center group-hover:bg-black group-hover:border-black transition-all duration-500">
                    <svg 
                      className="size-5 text-black group-hover:text-white transition-colors duration-500 group-hover:translate-x-1 group-hover:-translate-y-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth={1.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { number: '50k+', label: 'Happy Fans' },
            { number: '500+', label: 'Products' },
            { number: '100+', label: 'Anime Series' },
            { number: '20+', label: 'Countries' },
          ].map((stat, index) => (
            <div 
              key={index} 
              ref={(el) => (statsRef.current[index] = el)}
              className="text-center"
            >
              <div
                className="text-5xl md:text-6xl mb-3"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: '500',
                }}
              >
                {stat.number}
              </div>
              <div className="w-8 h-px bg-black/20 mx-auto mb-3" />
              <div
                className="text-sm uppercase text-zinc-600"
                style={{ letterSpacing: '0.2em' }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}