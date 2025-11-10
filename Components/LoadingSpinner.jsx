'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function LoadingSpinner() {
  const spinnerRef = useRef(null);

  useEffect(() => {
    gsap.to(spinnerRef.current, {
      rotation: 360,
      duration: 1,
      repeat: -1,
      ease: 'linear'
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div 
        ref={spinnerRef}
        className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full"
      />
      <p className="mt-4 text-gray-600 font-medium">Loading more products...</p>
    </div>
  );
}