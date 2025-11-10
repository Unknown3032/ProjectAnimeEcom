'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function ProductPage() {
  const containerRef = useRef(null);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Product data
  const product = {
    id: 1,
    name: 'Aura Chair',
    price: 450,
    description: 'A sculptural piece that combines minimalist design with exceptional comfort. Crafted for those who appreciate the beauty of simplicity.',
    images: [
      'https://i.pinimg.com/1200x/64/c4/1b/64c41bff6ce25d2bc485ebce2983e66a.jpg',
      'https://i.pinimg.com/1200x/d1/8b/9d/d18b9d3c51e9f562bacf68fb8141f557.jpg',
      'https://i.pinimg.com/1200x/da/5f/96/da5f96d10a59a6afe4b30743ec1dd59f.jpg',
    ],
    details: [
      { label: 'Material', value: 'Premium Oak Wood' },
      { label: 'Dimensions', value: 'H 80 × W 60 × D 60 cm' },
      { label: 'Weight', value: '12.5 kg' },
      { label: 'Color', value: 'Natural Wood' },
    ],
    features: ['Premium Quality', 'Minimal Design', 'Sustainable']
  };

  // Related products
  const relatedProducts = [
    {
      id: 2,
      name: 'Modern Stool',
      price: 220,
      image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=600&q=80',
    },
    {
      id: 3,
      name: 'Wooden Table',
      price: 890,
      image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80',
    },
    {
      id: 4,
      name: 'Floor Lamp',
      price: 320,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    },
  ];

  // Initialize animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set('.animate-on-load', { opacity: 0, y: 30 });

      // Staggered entrance animation
      gsap.to('.animate-on-load', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.2
      });

      // Scroll animations for related products
      gsap.utils.toArray('.related-product').forEach((product, i) => {
        gsap.from(product, {
          opacity: 0,
          y: 60,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: product,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Image gallery functions
  const changeImage = (index) => {
    if (index === activeImage) return;
    
    gsap.to('.main-image', {
      opacity: 0,
      scale: 1.05,
      duration: 0.3,
      ease: 'power2.inOut',
      onComplete: () => {
        setActiveImage(index);
        gsap.fromTo('.main-image', 
          { opacity: 0, scale: 0.95 },
          { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
        );
      }
    });
  };

  // Quantity functions
  const updateQuantity = (delta) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
    
    gsap.fromTo('.quantity-number',
      { scale: 1.3 },
      { scale: 1, duration: 0.2, ease: 'back.out(2)' }
    );
  };

  // Add to cart animation
  const handleAddToCart = () => {
   
  };

  return (
    <div ref={containerRef} className="bg-white text-black">
    

      {/* Main Product Section */}
      <section className="py-12 lg:py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            
            {/* Product Images */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative aspect-4/5 bg-gray-50 rounded-sm overflow-hidden">
                <img
                  src={product.images[activeImage]}
                  alt={product.name} 
                  className="main-image object-cover animate-on-load"
                />
                
                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium animate-on-load">
                  {activeImage + 1} / {product.images.length}
                </div>
              </div>

              {/* Thumbnail Navigation */}
              <div className="flex gap-4 justify-center animate-on-load">
                {product?.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => 
                     changeImage(index)
                    }
                    className={`relative aspect-square flex-1 max-w-24 rounded-sm overflow-hidden transition-all duration-300 ${
                      activeImage === index 
                        ? 'ring-2 ring-black' 
                        : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    {/* <div className="w-full h-full bg-gray-200" /> */}
                    <img className=' className="w-full h-full' src={img} alt="" />
                  </button>
                ))}
              </div>

              {/* Navigation Dots */}
              <div className="flex justify-center gap-2 animate-on-load">
                {product.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => changeImage(index)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      activeImage === index ? 'w-6 bg-black' : 'w-1 bg-black/20 hover:bg-black/40'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Product Information */}
            <div className="space-y-8">
              {/* Title & Collection */}
              <div className="space-y-4 animate-on-load">
                <p className="text-xs tracking-[0.3em] text-black/50">
                  ESSENTIALS COLLECTION
                </p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-light leading-[0.9]">
                  {product.name}
                </h1>
                <p className="text-2xl md:text-3xl font-light text-black/80">
                  ${product.price}
                </p>
              </div>

              {/* Description */}
              <p className="text-lg leading-relaxed text-black/60 max-w-md animate-on-load">
                {product.description}
              </p>

              {/* Product Details */}
              <div className="grid grid-cols-2 gap-4 py-6 border-y border-black/10 animate-on-load">
                {product.details.map((detail, index) => (
                  <div key={index} className="space-y-1">
                    <p className="text-xs tracking-wider text-black/50">{detail.label}</p>
                    <p className="text-sm font-medium">{detail.value}</p>
                  </div>
                ))}
              </div>

              {/* Features */}
              <div className="animate-on-load">
                <p className="text-sm tracking-wider mb-3">FEATURES</p>
                <div className="flex flex-wrap gap-3">
                  {product.features.map((feature, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 border border-black/20 rounded-full text-sm hover:border-black transition-colors"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-4 animate-on-load">
                <p className="text-sm tracking-wider">QUANTITY</p>
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => updateQuantity(-1)}
                    className="w-10 h-10 border border-black/20 rounded-full hover:border-black transition-all duration-300 flex items-center justify-center text-lg"
                  >
                    −
                  </button>
                  <span className="quantity-number text-xl font-light w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(1)}
                    className="w-10 h-10 border border-black/20 rounded-full hover:border-black transition-all duration-300 flex items-center justify-center text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="add-to-cart w-full bg-black text-white py-4 text-sm tracking-[0.2em] hover:bg-black/90 transition-colors duration-300 animate-on-load"
              >
                ADD TO CART
              </button>

              {/* Additional Info */}
              <div className="space-y-2 text-sm text-black/50 animate-on-load">
                <p>Free shipping worldwide</p>
                <p>30-day return policy</p>
                <p>Handcrafted with sustainable materials</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="py-16 lg:py-24 border-t border-black/10">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-light mb-4">
              You May Also Like
            </h2>
            <p className="text-black/60">
              Discover more from our collection
            </p>
          </div>

          {/* Related Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((item) => (
              <div
                key={item.id}
                className="related-product group cursor-pointer"
              >
                {/* Product Image */}
                <div className="relative aspect-[4/5] bg-gray-50 rounded-sm overflow-hidden mb-4">
                  <div className="w-full h-full bg-gray-200" />
                  
                  {/* Quick View Button */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/5">
                    <button className="bg-white text-black px-6 py-3 rounded-full text-sm font-medium tracking-wider transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      QUICK VIEW
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="space-y-2 text-center">
                  <h3 className="text-lg font-medium group-hover:opacity-60 transition-opacity duration-300">
                    {item.name}
                  </h3>
                  <p className="text-black/60">${item.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}