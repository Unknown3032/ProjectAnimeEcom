'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function TopProducts({ products }) {
  const containerRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 1 }
    );
  }, [products]);

  return (
    <div ref={containerRef} className="bg-white border border-black/10 rounded-lg overflow-hidden">
      <div className="p-6 border-b border-black/10">
        <h2 className="text-xl font-light">Top Products</h2>
        <p className="text-xs text-black/40 mt-1">Best selling items</p>
      </div>

      <div className="p-6 space-y-6">
        {products.length === 0 ? (
          <div className="text-center py-8 text-black/40">
            No products data available
          </div>
        ) : (
          products.map((product, index) => (
            <div key={product.id} className="flex items-center gap-4 group">
              <div className="flex-shrink-0 w-16 h-16 bg-gray-100 overflow-hidden rounded-lg">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = '/placeholder-product.jpg';
                  }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium mb-1 truncate group-hover:text-black/60 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-3 text-xs text-black/60">
                  <span>{product.sales} sales</span>
                  <span>•</span>
                  <span className="font-medium text-black">{product.revenue}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-black/40 mt-1">
                  <span>{product.category}</span>
                  {product.stock !== undefined && (
                    <>
                      <span>•</span>
                      <span className={product.stock < 10 ? 'text-red-600 font-medium' : ''}>
                        {product.stock} in stock
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
                  <span className="text-sm text-black/40 font-medium">#{index + 1}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-black/10 bg-black/[0.01]">
        <button className="text-sm font-medium hover:underline inline-flex items-center gap-1 group">
          View all products 
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
}