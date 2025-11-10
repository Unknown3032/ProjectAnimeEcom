'use client';

import { useRef } from 'react';
import gsap from 'gsap';

export default function ReviewCard({ review }) {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const avatarRef = useRef(null);
  const contentRef = useRef(null);

  const handleMouseEnter = () => {
    gsap.to(imageRef.current, {
      scale: 1.05,
      duration: 0.6,
      ease: 'power2.out'
    });

    gsap.to(avatarRef.current, {
      scale: 1.1,
      duration: 0.3,
      ease: 'back.out(1.7)'
    });

    gsap.to(cardRef.current, {
      y: -5,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.6,
      ease: 'power2.out'
    });

    gsap.to(avatarRef.current, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });

    gsap.to(cardRef.current, {
      y: 0,
      duration: 0.4,
      ease: 'power2.out'
    });
  };

  return (
    <div
      ref={cardRef}
      className="group bg-white border border-black/10 overflow-hidden hover:border-black/30 transition-colors duration-300"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Product Image */}
      <div className="relative h-48 md:h-56 overflow-hidden bg-gray-50">
        <img
          ref={imageRef}
          src={review.image}
          alt={review.product}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div ref={contentRef} className="p-5 md:p-6">
        {/* Rating */}
        <div className="flex items-center gap-1 mb-4">
          {[...Array(review.rating)].map((_, i) => (
            <svg
              key={i}
              className="w-4 h-4 text-black fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>

        {/* Review Text */}
        <p className="text-sm md:text-base font-light leading-relaxed mb-5 text-black/80">
          "{review.review}"
        </p>

        {/* Product Name */}
        <div className="mb-4 pb-4 border-b border-black/10">
          <p className="text-xs tracking-wider uppercase text-black/50 mb-1">
            Purchased
          </p>
          <p className="text-sm font-medium">
            {review.product}
          </p>
        </div>

        {/* Customer Info */}
        <div className="flex items-center gap-3">
          <div 
            ref={avatarRef}
            className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-black/10 flex-shrink-0"
          >
            <img
              src={review.avatar}
              alt={review.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm md:text-base truncate">
              {review.name}
            </p>
            <p className="text-xs text-black/50 truncate">
              {review.role}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-black/40">
              {review.date}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}