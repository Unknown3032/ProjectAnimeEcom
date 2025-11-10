'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ReviewCard from './ReviewCard';
import { customerReviews } from '@/lib/reviewsData';

gsap.registerPlugin(ScrollTrigger);

export default function CustomerReviews() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const statsRef = useRef(null);
  const gridRef = useRef(null);
  const [activeFilter, setActiveFilter] = useState('all');

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

      // Stats animation
      gsap.fromTo(
        '.stat-item',
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
          }
        }
      );

      // Grid animation
      gsap.fromTo(
        '.review-card',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const filters = [
    { id: 'all', label: 'All Reviews' },
    { id: 'recent', label: 'Most Recent' },
    { id: 'top', label: 'Top Rated' }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 md:py-28 lg:py-36 lg:pt-10 bg-white overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 50px, black 50px, black 51px), repeating-linear-gradient(90deg, transparent, transparent 50px, black 50px, black 51px)`
        }} />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div 
          ref={headerRef}
          className="max-w-4xl mx-auto text-center mb-12 md:mb-16"
        >
          <div className="mb-4">
            <span className="text-xs tracking-[0.3em] uppercase font-medium text-black/50">
              Testimonials
            </span>
          </div>

          <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extralight tracking-tight leading-none mb-6">
            Customer Love
          </h2>

          <p className="text-lg md:text-xl font-light text-black/70 max-w-2xl mx-auto">
            Join thousands of satisfied anime fans who trust us for their collectibles
          </p>
        </div>

        {/* Stats */}
        <div 
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto mb-12 md:mb-16"
        >
          <div className="stat-item text-center p-6 border border-black/10">
            <div className="text-3xl md:text-4xl lg:text-5xl font-light mb-2">
              15K+
            </div>
            <div className="text-xs md:text-sm tracking-wider uppercase text-black/60">
              Happy Customers
            </div>
          </div>

          <div className="stat-item text-center p-6 border border-black/10">
            <div className="text-3xl md:text-4xl lg:text-5xl font-light mb-2">
              4.9
            </div>
            <div className="text-xs md:text-sm tracking-wider uppercase text-black/60">
              Average Rating
            </div>
          </div>

          <div className="stat-item text-center p-6 border border-black/10">
            <div className="text-3xl md:text-4xl lg:text-5xl font-light mb-2">
              98%
            </div>
            <div className="text-xs md:text-sm tracking-wider uppercase text-black/60">
              Satisfaction Rate
            </div>
          </div>

          <div className="stat-item text-center p-6 border border-black/10">
            <div className="text-3xl md:text-4xl lg:text-5xl font-light mb-2">
              24/7
            </div>
            <div className="text-xs md:text-sm tracking-wider uppercase text-black/60">
              Customer Support
            </div>
          </div>
        </div>

        

        {/* Reviews Grid */}
        <div 
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16"
        >
          {customerReviews.map((review) => (
            <div key={review.id} className="review-card">
              <ReviewCard review={review} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="mb-6">
            <p className="text-sm md:text-base font-light text-black/60">
              Want to share your experience?
            </p>
          </div>
          <button className=" cursor-pointer group inline-flex items-center gap-3 px-8 md:px-12 py-4 md:py-5 border border-black overflow-hidden relative hover:text-white transition-colors duration-300">
            <span className="relative z-10 text-sm font-medium tracking-[0.2em] uppercase">
              Write a Review
            </span>
            <svg 
              className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </button>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-0 w-40 h-40 border-l border-t border-black/5" />
      <div className="absolute bottom-20 right-0 w-40 h-40 border-r border-b border-black/5" />
    </section>
  );
}