'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const WishlistSection = () => {
  const containerRef = useRef(null);
  const [wishlist, setWishlist] = useState([
    { id: 1, name: 'Naruto Uzumaki Figure', price: 89.99, image: '🎎', inStock: true },
    { id: 2, name: 'Attack on Titan Poster', price: 34.99, image: '🖼️', inStock: true },
    { id: 3, name: 'Demon Slayer Keychain', price: 12.99, image: '🔑', inStock: false },
    { id: 4, name: 'One Piece Mug', price: 24.99, image: '☕', inStock: true },
  ]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(containerRef.current?.children || [], {
        opacity: 0,
        scale: 0.95,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleRemove = (id) => {
    setWishlist(wishlist.filter(item => item.id !== id));
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-black mb-2">Wishlist</h1>
          <p className="text-black/50">{wishlist.length} items saved for later</p>
        </div>
      </div>

      {/* Wishlist Grid */}
      {wishlist.length > 0 ? (
        <div ref={containerRef} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="group bg-white border border-black/10 rounded-2xl overflow-hidden hover:border-black/30 transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-square bg-gradient-to-br from-black/5 to-black/10 flex items-center justify-center">
                <span className="text-7xl group-hover:scale-110 transition-transform duration-500">{item.image}</span>
                
                {!item.inStock && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
                    <span className="px-4 py-2 bg-white text-black text-sm font-bold rounded-lg">
                      Out of Stock
                    </span>
                  </div>
                )}

                <button
                  onClick={() => handleRemove(item.id)}
                  className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-50 hover:text-red-600"
                >
                  <span className="text-lg">✕</span>
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-black mb-2 line-clamp-2">{item.name}</h3>
                <p className="text-2xl font-bold text-black mb-4">${item.price}</p>

                <button className="w-full px-4 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-black/90 transition-all">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-black/10 rounded-2xl p-16 text-center">
          <div className="text-7xl mb-4">❤️</div>
          <h3 className="text-2xl font-bold text-black mb-2">Your Wishlist is Empty</h3>
          <p className="text-black/50 mb-6">Save items you love to view them later</p>
          <button className="px-8 py-4 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-all">
            Browse Products
          </button>
        </div>
      )}
    </div>
  );
};

export default WishlistSection;