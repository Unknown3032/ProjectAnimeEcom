'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const slideRefs = useRef([]);
  const contentRefs = useRef([]);
  const autoPlayRef = useRef(null);

  const slides = [
    {
      id: 1,
      title: 'Posters',
      collection: 'Anime Poster',
      tagline: 'gifts for ninja souls',
      image: 'banner1.jpeg',
    },
    {
      id: 2,
      title: 'Keychains',
      collection: 'grand line treasures',
      tagline: 'treasures for pirates',
      image: 'banner2.png',
    },
    {
      id: 3,
      title: 'Mugs',
      collection: 'Best Acrylic Mugs',
      tagline: 'gear for warriors',
      image: 'banner3.jpeg',
    },
    {
      id: 4,
      title: 'Anime Products',
      collection: 'plus ultra collection',
      tagline: 'gifts for heroes',
      image: 'https://i.pinimg.com/736x/cf/d5/91/cfd591229a37e015cd540c4f991cc330.jpg',
    },
  ];

  // Auto-play functionality
  useEffect(() => {
    if (!isPaused) {
      autoPlayRef.current = setInterval(() => {
        changeSlide((currentSlide + 1) % slides.length);
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [currentSlide, isPaused]);

  useEffect(() => {
    if (contentRefs.current[0]) {
      const tl = gsap.timeline({ delay: 0.5 });
      
      tl.fromTo(
        contentRefs.current[0].querySelectorAll('.animate-item'),
        { x: -60, opacity: 0 },
        { 
          x: 0, 
          opacity: 1, 
          duration: 1.2,
          stagger: 0.15,
          ease: 'power4.out'
        }
      );
    }
  }, []);

  const changeSlide = (newIndex) => {
    if (isAnimating || newIndex === currentSlide) return;
    if (newIndex < 0 || newIndex >= slides.length) return;

    setIsAnimating(true);

    const currentContent = contentRefs.current[currentSlide];
    const newContent = contentRefs.current[newIndex];
    const currentSlideEl = slideRefs.current[currentSlide];
    const newSlideEl = slideRefs.current[newIndex];

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentSlide(newIndex);
        setIsAnimating(false);
      }
    });

    // Exit
    tl.to(currentContent.querySelectorAll('.animate-item'), {
      x: -40,
      opacity: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power3.in'
    });

    tl.to(currentSlideEl, {
      opacity: 0,
      duration: 0.4
    }, '-=0.3');

    // Enter
    tl.set(newSlideEl, { zIndex: 10 });
    
    tl.fromTo(newSlideEl,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }
    );

    tl.fromTo(
      newContent.querySelectorAll('.animate-item'),
      { x: -60, opacity: 0 },
      { 
        x: 0, 
        opacity: 1, 
        duration: 1,
        stagger: 0.12,
        ease: 'power4.out'
      },
      '-=0.3'
    );

    tl.set(currentSlideEl, { zIndex: 1 });
  };

  const handlePauseToggle = () => {
    setIsPaused(!isPaused);
  };

  return (
    <div 
      className="relative size-full h-[88vh] bg-black text-white overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          ref={(el) => (slideRefs.current[index] = el)}
          className="absolute inset-0"
          style={{ 
            zIndex: index === currentSlide ? 10 : 1,
            opacity: index === 0 ? 1 : 0
          }}
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="size-full object-cover"
              style={{ 
                filter: ' brightness(0.9) contrast(1.2)',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div 
            ref={(el) => (contentRefs.current[index] = el)}
            className="relative z-10 h-full flex items-center"
          >
            <div className="max-w-screen-2xl mx-auto px-12 lg:px-20 w-full">
              <div className="max-w-2xl space-y-8">
                
                {/* Collection Tag */}
                <div className="animate-item flex items-center gap-4">
                  <div className="w-12 h-px bg-white/30" />
                  <span 
                    className="text-[11px] uppercase text-zinc-500 font-light"
                    style={{ 
                      letterSpacing: '0.3em',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  >
                    {slide.collection}
                  </span>
                </div>

                {/* Main Title - Serif Font */}
                <h1 
                  className="animate-item text-7xl md:text-8xl lg:text-9xl text-white"
                  style={{ 
                    letterSpacing: '-0.02em',
                    lineHeight: '0.9',
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: '400',
                  }}
                >
                  {slide.title}
                </h1>

                {/* Decorative Line */}
                <div className="animate-item w-24 h-px bg-white/20" />

                {/* Tagline */}
                <p 
                  className="animate-item text-base md:text-lg text-zinc-400 font-light"
                  style={{ 
                    letterSpacing: '0.05em',
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '300'
                  }}
                >
                  {slide.tagline}
                </p>

                {/* CTA */}
                <div className="animate-item pt-6 flex items-center gap-6">
                  <button 
                    onClick={() => changeSlide((currentSlide + 1) % slides.length)}
                    className="group relative px-10 py-3 overflow-hidden cursor-pointer"
                  >
                    <span 
                      className="relative z-10 text-sm uppercase text-white font-light"
                      style={{ 
                        letterSpacing: '0.2em',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      explore 
                    </span>
                    <div className="absolute inset-0 border border-white/30" />
                    <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                    <span 
                      className="absolute inset-0 flex items-center justify-center text-sm uppercase font-light text-black opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ 
                        letterSpacing: '0.2em',
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      explore 
                    </span>
                  </button>

                  {/* View Details Link */}
                  <button 
                    className="group flex items-center gap-2 text-sm text-zinc-500 hover:text-white transition-colors duration-300"
                    style={{ 
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: '300'
                    }}
                  >
                    <span>View details</span>
                    <svg className="size-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Frame */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 start-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <div className="absolute bottom-0 start-0 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <div className="absolute top-0 start-0 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
            <div className="absolute top-0 end-0 w-px h-full bg-gradient-to-b from-transparent via-white/5 to-transparent" />
          </div>
        </div>
      ))}

      {/* Minimal Navigation */}
      <div className="absolute inset-0 pointer-events-none z-20">
        
        {/* Slide Progress with Auto-play indicator */}
        <div className="pointer-events-auto absolute top-8 start-8 flex items-center gap-6">
          <div 
            className="flex items-baseline gap-2 font-light"
            style={{ 
              letterSpacing: '-0.02em',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            <span className="text-xl">{String(currentSlide + 1).padStart(2, '0')}</span>
            <span className="text-zinc-700 text-sm">/</span>
            <span className="text-zinc-700 text-sm">{String(slides.length).padStart(2, '0')}</span>
          </div>

          {/* Auto-play indicator */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePauseToggle}
              className="text-zinc-700 hover:text-white transition-colors duration-300"
            >
              {isPaused ? (
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              ) : (
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              )}
            </button>
            <div className="w-8 h-px bg-white/10 overflow-hidden">
              {!isPaused && (
                <div 
                  className="h-full bg-white/40"
                  style={{
                    animation: 'progress 5s linear infinite',
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Brand */}
        <div className="absolute top-8 end-8">
          <span 
            className="text-[11px] uppercase text-zinc-700 font-light"
            style={{ 
              letterSpacing: '0.3em',
              fontFamily: 'Inter, sans-serif'
            }}
          >
            anime gifts
          </span>
        </div>

        {/* Navigation Dots */}
        <div className="pointer-events-auto absolute end-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => changeSlide(index)}
              disabled={isAnimating}
              className="group relative"
            >
              <div className={`size-1.5 rounded-full transition-all duration-500 ${
                index === currentSlide 
                  ? 'bg-white' 
                  : 'bg-white/20 group-hover:bg-white/40'
              }`} />
              {index === currentSlide && (
                <div className="absolute inset-0 -m-2">
                  <div className="size-full rounded-full border border-white/20" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-8 start-8 end-8 flex items-end justify-between">
          {/* Next Button */}
          <div className="pointer-events-auto">
            <button
              onClick={() => changeSlide((currentSlide + 1) % slides.length)}
              disabled={isAnimating}
              className="group flex items-center gap-3 text-[11px] uppercase text-zinc-700 font-light hover:text-white transition-colors duration-300"
              style={{ 
                letterSpacing: '0.3em',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <span>next</span>
              <svg className="size-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-64 h-px bg-white/5 overflow-hidden">
            <div 
              className="h-full bg-white/30 transition-all duration-700 ease-out"
              style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Subtle Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.01]"
        style={{
          backgroundImage: `
            linear-gradient(white 1px, transparent 1px),
            linear-gradient(90deg, white 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      <style jsx>{`
        @keyframes progress {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0%);
          }
        }
      `}</style>
    </div>
  );
}