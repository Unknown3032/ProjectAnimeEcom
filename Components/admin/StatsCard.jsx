'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function StatsCard({ stat, index }) {
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 20 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        ease: 'power2.out',
        delay: 0.4 + (index * 0.1)
      }
    );
  }, [index]);

  // Function to convert currency symbol from $ to ₹
  const formatValue = (value) => {
    if (typeof value === 'string') {
      return value.replace(/\$/g, '₹');
    }
    return value;
  };

  return (
    <div 
      ref={cardRef}
      className="bg-white border border-black/10 p-6 hover:border-black/30 transition-all duration-300 hover:shadow-lg group"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs tracking-wider uppercase text-black/40">
          {stat.label}
        </span>
        <span className={`text-xs font-medium px-2 py-1 rounded ${
          stat.isPositive 
            ? 'bg-green-50 text-green-700' 
            : 'bg-red-50 text-red-700'
        }`}>
          {stat.change}
        </span>
      </div>
      <div className="text-4xl font-extralight group-hover:scale-105 transition-transform">
        {formatValue(stat.value)}
      </div>
    </div>
  );
}