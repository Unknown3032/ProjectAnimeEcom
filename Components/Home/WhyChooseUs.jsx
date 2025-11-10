'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { features } from '@/lib/featuresData';

gsap.registerPlugin(ScrollTrigger);

export default function WhyChooseUs() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );

      // Animate each feature section
      features.forEach((_, index) => {
        gsap.fromTo(
          `.feature-section-${index}`,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: `.feature-section-${index}`,
              start: 'top 80%',
            }
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative py-10 md:py-15 lg:py-20 bg-white"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div 
          ref={headerRef}
          className="max-w-3xl mb-20 md:mb-32"
        >
          <span className="block text-xs tracking-[0.3em] uppercase font-medium text-black/50 mb-4">
            Excellence in Every Detail
          </span>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-extralight tracking-tight leading-none">
            Why We're Different
          </h2>
        </div>

        {/* Features */}
        <div className="space-y-20 md:space-y-32 lg:space-y-40">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`feature-section-${index} grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center ${
                index % 2 === 1 ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Image Side */}
              <div 
                className={`relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden group ${
                  index % 2 === 1 ? 'md:order-2' : ''
                }`}
              >
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-white opacity-20 group-hover:opacity-10 transition-opacity duration-500" />
                
                {/* Large Number Overlay */}
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[16rem] md:text-[20rem] font-extralight leading-none opacity-20 pointer-events-none"
                  style={{ 
                    WebkitTextStroke: '2px white',
                    color: 'transparent'
                  }}
                >
                  {feature.number}
                </div>
              </div>

              {/* Content Side */}
              <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                <div className="max-w-lg">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 md:w-16 md:h-16 text-black">
                      {feature.icon}
                    </div>
                    <span className="text-sm tracking-[0.3em] uppercase font-medium text-black/50">
                      {feature.number}
                    </span>
                  </div>

                  <h3 className="text-3xl md:text-4xl lg:text-5xl font-extralight mb-6 leading-tight">
                    {feature.title}
                  </h3>

                  <div className="w-16 h-px bg-black mb-6" />

                  <p className="text-base md:text-lg font-light leading-relaxed text-black/70">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}