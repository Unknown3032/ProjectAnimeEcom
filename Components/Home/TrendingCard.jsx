"use client";

import { useRef } from "react";
import gsap from "gsap";
import Link from "next/link";

export default function TrendingCard({ product, index }) {
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  // Format price in INR
  const formatINR = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleMouseEnter = () => {
    gsap.to(imageRef.current, {
      scale: 1.05,
      duration: 0.6,
      ease: "power2.out",
    });

    gsap.to(overlayRef.current, {
      opacity: 0.7,
      duration: 0.4,
      ease: "power2.out",
    });

    gsap.to(contentRef.current, {
      y: -10,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
    });

    gsap.to(overlayRef.current, {
      opacity: 0.4,
      duration: 0.4,
      ease: "power2.out",
    });

    gsap.to(contentRef.current, {
      y: 0,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const discount = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div
      ref={cardRef}
      className="group relative h-[500px] md:h-[600px] overflow-hidden bg-white cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Image */}
      <div className="absolute inset-0">
        <img
          ref={imageRef}
          src={product?.images[0]?.url}
          alt={product?.name}
          className="w-full h-full object-cover transition-all duration-700"
        />
      </div>

      {/* Overlay */}
      <div ref={overlayRef} className="absolute inset-0 bg-black opacity-40" />

      {/* Trending Number */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-white">
        <span className="text-xl md:text-2xl font-light text-white">
          {product.trending}
        </span>
      </div>

      {/* Badge */}
      {product.badge && (
        <div className="absolute top-4 right-4 md:top-6 md:right-6 px-2.5 py-1 md:px-3 md:py-1.5 bg-white text-black text-xs font-bold tracking-wider uppercase">
          {product.badge}
        </div>
      )}

      {/* Discount */}
      {discount > 0 && (
        <div className="absolute top-16 md:top-20 right-4 md:right-6 px-2.5 py-1 md:px-3 md:py-1.5 bg-black text-white text-xs font-bold">
          -{discount}%
        </div>
      )}

      {/* Content */}
      <div
        ref={contentRef}
        className="absolute inset-x-0 bottom-0 p-5 md:p-8 text-white"
      >
        <div className="mb-2">
          <span className="text-xs tracking-widest uppercase font-medium opacity-80">
            {product.category}
          </span>
        </div>

        <h3 className="text-xl md:text-3xl font-light mb-3 md:mb-4 leading-tight">
          {product.name}
        </h3>

        {/* Updated Price Display with INR */}
        <div className="flex items-baseline gap-2 md:gap-3 mb-4 md:mb-6">
          <span className="text-2xl md:text-4xl font-light">
            {formatINR(product.price || 0)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-base md:text-lg text-white/60 line-through">
              {formatINR(product.originalPrice)}
            </span>
          )}
        </div>

        <Link href={`/products/${product?._id}`} className="block w-full">
          <button className="w-full cursor-pointer py-3 border border-white text-white font-bold tracking-wider uppercase text-xs md:text-sm hover:bg-white hover:text-black transition-all duration-300">
            View Product
          </button>
        </Link>
      </div>
    </div>
  );
}