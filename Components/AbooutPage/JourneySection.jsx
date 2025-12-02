'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function JourneySection() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const timelineItems = useRef([]);

  const milestones = [
    {
      year: '2020',
      title: 'The Beginning',
      description: 'Started as a small project by two anime enthusiasts who wanted to create something special for the community.',
      image: 'https://wallpapercave.com/wp/wp9357953.jpg',
    },
    {
      year: '2021',
      title: 'First Collection',
      description: 'Launched our first curated collection featuring merchandise from top anime series, reaching 1000+ happy fans.',
      image: '/firstCollection.jpg',
    },
    {
      year: '2022',
      title: 'Growing Together',
      description: 'Expanded our catalog to 500+ products and partnered with official distributors to bring authentic merchandise.',
      image: 'https://wallpapercave.com/wp/wp9435429.jpg',
    },
    {
      year: '2023',
      title: 'Community First',
      description: 'Reached 50,000+ community members and introduced personalized gifting options based on user feedback.',
      image: 'https://wallpapercave.com/wp/wp9435507.jpg',
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      // Timeline items animations
      timelineItems.current.forEach((item, index) => {
        if (!item) return;

        const image = item.querySelector('.journey-image');
        const content = item.querySelector('.journey-content');
        const year = item.querySelector('.journey-year');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            start: 'top 75%',
            end: 'bottom 25%',
            toggleActions: 'play none none reverse',
          },
        });

        tl.fromTo(
          year,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }
        )
        .fromTo(
          image,
          { x: index % 2 === 0 ? -100 : 100, opacity: 0 },
          { x: 0, opacity: 1, duration: 1, ease: 'power3.out' },
          '-=0.4'
        )
        .fromTo(
          content.children,
          { y: 40, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.8, 
            stagger: 0.1,
            ease: 'power3.out' 
          },
          '-=0.6'
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="bg-white text-black py-32">
      <div className="max-w-screen-2xl mx-auto px-8 lg:px-20">
        {/* Section Title */}
        <div ref={titleRef} className="mb-32 text-center">
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-12 h-px bg-black/20" />
            <span
              className="text-[11px] uppercase text-zinc-500"
              style={{ letterSpacing: '0.3em' }}
            >
              our journey
            </span>
            <div className="w-12 h-px bg-black/20" />
          </div>
          <h2
            className="text-5xl md:text-6xl lg:text-7xl text-black"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontWeight: '400',
              letterSpacing: '-0.02em',
            }}
          >
            Building Dreams
          </h2>
        </div>

        {/* Timeline */}
        <div className="space-y-40">
          {milestones.map((milestone, index) => (
            <div
              key={index}
              ref={(el) => (timelineItems.current[index] = el)}
              className="relative"
            >
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                {/* Content */}
                <div 
                  className={`journey-content space-y-6 ${
                    index % 2 === 1 ? 'lg:order-2' : ''
                  }`}
                >
                  <div
                    className="journey-year text-9xl md:text-[12rem] font-light text-black/5"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                  >
                    {milestone.year}
                  </div>
                  <h3
                    className="text-4xl md:text-5xl text-black"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontWeight: '500',
                    }}
                  >
                    {milestone.title}
                  </h3>
                  <div className="w-16 h-px bg-black/20" />
                  <p
                    className="text-lg md:text-xl text-zinc-600 leading-relaxed max-w-lg"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: '300',
                    }}
                  >
                    {milestone.description}
                  </p>
                </div>

                {/* Image */}
                <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="journey-image relative aspect-[4/3] overflow-hidden group">
                    <img
                      src={milestone.image}
                      alt={milestone.title}
                      className="size-full object-cover transition-all duration-700 group-hover:scale-105"
                      style={{ filter: 'grayscale(20%)' }}
                    />
                    <div className="absolute inset-0 border-2 border-black/10 group-hover:border-black/30 transition-colors duration-500" />
                    
                    {/* Decorative number */}
                    <div 
                      className="absolute bottom-8 end-8 text-6xl font-light text-white/80"
                      style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}