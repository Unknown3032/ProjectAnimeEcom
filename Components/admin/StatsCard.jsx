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

  return (
    <div 
      ref={cardRef}
      className="bg-white border border-black/10 p-6 hover:border-black/30 transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-xs tracking-wider uppercase text-black/40">
          {stat.label}
        </span>
        <span className={`text-xs font-medium ${
          stat.isPositive ? 'text-black' : 'text-black/40'
        }`}>
          {stat.change}
        </span>
      </div>
      <div className="text-4xl font-extralight">
        {stat.value}
      </div>
    </div>
  );
}