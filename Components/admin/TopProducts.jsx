'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { topProducts } from '@/lib/dashboardData';

export default function TopProducts() {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 1 }
    );
  }, []);

  return (
    <div ref={containerRef} className="bg-white border border-black/10">
      <div className="p-6 border-b border-black/10">
        <h2 className="text-xl font-light">Top Products</h2>
      </div>

      <div className="p-6 space-y-6">
        {topProducts.map((product, index) => (
          <div key={product.id} className="flex items-center gap-4">
            <div className="flex-shrink-0 w-16 h-16 bg-gray-100 overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium mb-1 truncate">
                {product.name}
              </h3>
              <div className="flex items-center gap-4 text-xs text-black/60">
                <span>{product.sales} sales</span>
                <span>•</span>
                <span className="font-medium text-black">{product.revenue}</span>
              </div>
            </div>

            <div className="flex-shrink-0 text-sm text-black/40">
              #{index + 1}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-black/10">
        <button className="text-sm font-medium hover:underline">
          View all products →
        </button>
      </div>
    </div>
  );
}