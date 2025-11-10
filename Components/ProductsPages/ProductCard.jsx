'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

export default function ProductCard({ product, viewMode }) {
  const cardRef = useRef(null);
  const imageRef = useRef(null);

  const handleMouseEnter = () => {
    gsap.to(imageRef.current, {
      scale: 1.05,
      duration: 0.6,
      ease: 'power2.out'
    });

    gsap.to(cardRef.current, {
      y: -4,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.6,
      ease: 'power2.out'
    });

    gsap.to(cardRef.current, {
      y: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  if (viewMode === 'list') {
    return (
      <div
        ref={cardRef}
        className="product-card flex flex-col sm:flex-row gap-4 sm:gap-6 bg-white border border-gray-200 rounded-lg overflow-hidden group cursor-pointer hover:border-gray-400 transition-colors"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Image */}
        <div className="relative w-full sm:w-48 md:w-64 h-64 sm:h-48 overflow-hidden bg-gray-50 flex-shrink-0">
          <div ref={imageRef} className="w-full h-full">
            <img
              src={product.image}
              alt={product.name}
              className="object-cover  group-hover:grayscale-0 transition-all duration-700"
              sizes="(max-width: 640px) 100vw, 256px"
            />
          </div>
          
          {discount > 0 && (
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-white text-black text-xs font-bold border border-gray-300">
              -{discount}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg md:text-xl font-bold mb-2 line-clamp-2">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
            
            {/* Rating - No Reviews */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600 mb-3">
              <div className="flex items-center">
                <span className="text-black mr-1">★</span>
                <span className="font-medium">{product.rating}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            <button className="px-4 sm:px-6 py-2 sm:py-3 bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors whitespace-nowrap">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid View - Minimal & Premium
  return (
    <div
      ref={cardRef}
      className="product-card bg-white border border-gray-200 overflow-hidden group cursor-pointer hover:border-gray-400 transition-colors"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-50">
        <div ref={imageRef} className="w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="object-cover  group-hover:grayscale-0 transition-all duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-white text-black text-xs font-bold border border-gray-300">
            -{discount}%
          </div>
        )}

        {/* Mobile: Always Show Add to Cart */}
        <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-white via-white/95 to-transparent sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-full py-2.5 sm:py-3 bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 border-t border-gray-200">
        <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2 line-clamp-2">{product.name}</h3>
        
        {/* Desktop: Show description */}
        <p className="hidden sm:block text-sm text-gray-600 mb-3 line-clamp-1">{product.description}</p>

        {/* Rating - No Reviews Count */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-700 mb-2 sm:mb-3">
          <span className="text-black">★</span>
          <span className="font-medium">{product.rating}</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-black">${product.price}</span>
          {product.originalPrice && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              ${product.originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}