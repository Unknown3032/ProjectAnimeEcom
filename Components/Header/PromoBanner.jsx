"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function PromoBanner() {
  const [showBanner, setShowBanner] = useState(true);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const promoRef = useRef(null);
  const bannerRef = useRef(null);

  const promoMessages = [
    {
      text: "🎉 FLASH SALE: 50% OFF ON ALL PRODUCTS",
      link: "/productspage/all",
    },
    {
      text: "🚚 FREE SHIPPING ON ORDERS OVER ₹500",
      link: "/productspage/all",
    },
    {
      text: "⭐ NEW ARRIVALS - SHOP NOW",
      link: "/productspage/all",
    },
  ];

  // Auto-rotate promotional messages
  useEffect(() => {
    if (promoMessages.length > 1 && showBanner) {
      const interval = setInterval(() => {
        setCurrentPromoIndex((prev) => (prev + 1) % promoMessages.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [promoMessages.length, showBanner]);

  // Animate message change
  useEffect(() => {
    if (promoRef.current && showBanner) {
      gsap.fromTo(
        promoRef.current,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [currentPromoIndex, showBanner]);

  // Handle close with animation
  // const handleClose = () => {
  //   gsap.to(bannerRef.current, {
  //     height: 0,
  //     opacity: 0,
  //     duration: 0.3,
  //     ease: "power2.inOut",
  //     onComplete: () => setShowBanner(false),
  //   });
  // };

  if (!showBanner) return null;

  const currentPromo = promoMessages[currentPromoIndex];

  return (
    <div
      ref={bannerRef}
      className="bg-black text-white overflow-hidden fixed top-0 left-0 right-0 z-50"
    >
      <div className="relative h-10 sm:h-12">
        <div className="flex items-center justify-center h-full px-4">
          {/* Close Button - Mobile Left */}
          {/* <button
            onClick={handleClose}
            className="absolute left-2 sm:left-4 p-1 hover:bg-white/10 rounded transition-colors lg:opacity-0 lg:pointer-events-none"
            aria-label="Close promotion banner"
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button> */}

          {/* Promo Message */}
          <Link
            href={currentPromo.link}
            className="flex-1 text-center group px-8 sm:px-12"
          >
            <span
              ref={promoRef}
              className="text-[10px] xs:text-xs sm:text-sm font-medium tracking-wider uppercase group-hover:underline underline-offset-4 inline-block"
            >
              {currentPromo.text}
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <div className="absolute right-4 hidden lg:flex items-center gap-3">
            {/* Dots Indicator */}
            <div className="flex items-center gap-1.5">
              {promoMessages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPromoIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === currentPromoIndex
                      ? "bg-white w-6 h-1.5"
                      : "bg-white/40 hover:bg-white/60 w-1.5 h-1.5"
                  }`}
                  aria-label={`Go to promotion ${index + 1}`}
                />
              ))}
            </div>

            {/* Close Button - Desktop */}
            {/* <button
              onClick={handleClose}
              className="p-1 hover:bg-white/10 rounded transition-colors ml-2"
              aria-label="Close"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button> */}
          </div>

          {/* Arrow Navigation - Mobile */}
          <div className="absolute right-2 sm:right-4 flex lg:hidden items-center gap-1 sm:gap-2">
            <button
              onClick={() =>
                setCurrentPromoIndex(
                  (prev) =>
                    (prev - 1 + promoMessages.length) % promoMessages.length
                )
              }
              className="p-1 hover:bg-white/10 rounded transition-colors"
              aria-label="Previous promotion"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() =>
                setCurrentPromoIndex(
                  (prev) => (prev + 1) % promoMessages.length
                )
              }
              className="p-1 hover:bg-white/10 rounded transition-colors"
              aria-label="Next promotion"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20">
          <div
            className="h-full bg-white transition-all duration-300 ease-linear"
            style={{
              width: `${
                ((currentPromoIndex + 1) / promoMessages.length) * 100
              }%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}