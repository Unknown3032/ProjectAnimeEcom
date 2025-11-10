// components/FeaturedSection.jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const FeaturedSection = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const featuredContent = {
    subtitle: "Limited Edition",
    title: "Collector's Series",
    description: "Discover our exclusive collection of premium anime figures and collectibles, meticulously crafted for true enthusiasts.",
    cta: "Explore Collection",
    link: "/featured",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1400&h=900&fit=crop&crop=center&auto=format&q=85"
  };

  useEffect(() => {
    // Preload image
    const img = new Image();
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true);
    img.src = featuredContent.image;

    // Simple scroll animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo(contentRef.current.children, {
      y: 50,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out"
    });

  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative h-screen bg-black overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={featuredContent.image}
          alt={featuredContent.title}
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />
        
        {/* Loading State */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl">
            <div ref={contentRef}>
              <p className="text-sm uppercase tracking-widest text-white/70 font-medium mb-6">
                {featuredContent.subtitle}
              </p>
              
              <h2 className="text-5xl md:text-7xl font-light text-white mb-8 tracking-tight">
                {featuredContent.title}
              </h2>
              
              <p className="text-xl text-white/90 mb-12 font-light leading-relaxed">
                {featuredContent.description}
              </p>
              
              <Link href={featuredContent.link}>
                <button className="group cursor-pointer relative px-8 py-4 border border-white text-white text-sm font-medium tracking-wide uppercase overflow-hidden transition-all duration-300 hover:bg-white hover:text-black">
                  <span className="relative z-10">
                    {featuredContent.cta}
                  </span>
                  <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;