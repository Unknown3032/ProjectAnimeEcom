// components/TrendingSection.jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TrendingSection = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const itemsRef = useRef([]);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [cartItems, setCartItems] = useState({});

  const trendingProducts = [
    {
      id: 1,
      name: "Demon Slayer Premium Figure",
      series: "Kimetsu no Yaiba",
      price: "199",
      originalPrice: "999",
      image: "https://i.pinimg.com/1200x/4c/5e/68/4c5e68bda1af915ecc7bc0dbc9971386.jpg",
      badge: "Trending #1",
      description: "Limited edition collectible figure with premium detailing and authentic design."
    },
    {
      id: 2,
      name: "Attack on Titan Hoodie",
      series: "Shingeki no Kyojin",
      price: "2,799",
      originalPrice: "3,299",
      image: "https://i.pinimg.com/736x/87/6d/8a/876d8a371f0e7b2e4f7bca606ba7534e.jpg",
      badge: "Hot Seller",
      description: "Premium quality hoodie with embroidered logo and comfortable fit."
    },
    {
      id: 3,
      name: "Naruto Art Collection",
      series: "Naruto Shippuden",
      price: "299",
      originalPrice: "999",
      image: "https://i.pinimg.com/1200x/6e/87/58/6e8758e59cf5929fde535e39f2c9bbe3.jpg",
      badge: "Limited Edition",
      description: "Museum quality art prints featuring iconic scenes and characters."
    }
  ];

  useEffect(() => {
    // Preload images
    trendingProducts.forEach(product => {
      const img = new Image();
      img.onload = () => {
        setImagesLoaded(prev => ({
          ...prev,
          [product.id]: true
        }));
      };
      img.onerror = () => {
        setImagesLoaded(prev => ({
          ...prev,
          [product.id]: true
        }));
      };
      img.src = product.image;
    });

    // Scroll animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo(headerRef.current, {
      y: 30,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    })
    .fromTo(itemsRef.current, {
      x: 100,
      opacity: 0
    }, {
      x: 0,
      opacity: 1,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out"
    }, "-=0.4");

  }, []);

  const handleItemHover = (index, isEntering) => {
    const item = itemsRef.current[index];
    const image = item?.querySelector('.product-image');
    const content = item?.querySelector('.product-content');
    const actions = item?.querySelector('.product-actions');
    
    if (image && content && actions) {
      const tl = gsap.timeline();
      
      if (isEntering) {
        tl.to(image, {
          scale: 1.05,
          duration: 0.6,
          ease: "power2.out"
        })
        .to(content, {
          x: 10,
          duration: 0.4,
          ease: "power2.out"
        }, 0)
        .to(actions, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "back.out(1.7)"
        }, 0.2);
      } else {
        tl.to(image, {
          scale: 1,
          duration: 0.6,
          ease: "power2.out"
        })
        .to(content, {
          x: 0,
          duration: 0.4,
          ease: "power2.out"
        }, 0)
        .to(actions, {
          opacity: 0,
          y: 20,
          duration: 0.3,
          ease: "power2.in"
        }, 0);
      }
    }
  };

  const handleAddToCart = (productId) => {
    setCartItems(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));

    // Cart animation
    const button = document.querySelector(`[data-product="${productId}"] .cart-btn`);
    if (button) {
      gsap.to(button, {
        scale: 1.2,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      });
    }
  };

  const handleBuyNow = (productId) => {
    // Buy now animation
    const button = document.querySelector(`[data-product="${productId}"] .buy-btn`);
    if (button) {
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      });
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-white"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div 
          ref={headerRef}
          className="mb-16"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-px bg-black" />
            <span className="text-sm uppercase tracking-[0.3em] text-neutral-500 font-medium">
              Trending Now
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-light text-black tracking-tight">
            Most Popular
          </h2>
        </div>

        {/* Products List */}
        <div className="space-y-8">
          {trendingProducts.map((product, index) => (
            <div
              key={product.id}
              ref={el => itemsRef.current[index] = el}
              data-product={product.id}
              className="group relative"
              onMouseEnter={() => handleItemHover(index, true)}
              onMouseLeave={() => handleItemHover(index, false)}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ">
                {/* Image Side */}
                <div className={`relative overflow-hidden bg-neutral-50 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="aspect-4/3 relative cursor-pointer">
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`product-image w-full h-full  object-cover transition-opacity duration-500 ${
                        imagesLoaded[product.id] ? 'opacity-100' : 'opacity-0'
                      }`}
                      loading="lazy"
                    />
                    
                    {/* Loading State */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 transition-opacity duration-500 ${
                      imagesLoaded[product.id] ? 'opacity-0' : 'opacity-100'
                    }`}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-neutral-400 border-t-black rounded-full animate-spin" />
                      </div>
                    </div>

                    {/* Badge */}
                    <div className="absolute top-6 left-6 bg-black text-white px-4 py-2 text-xs font-medium uppercase tracking-wide">
                      {product.badge}
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className={`product-content space-y-6 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div>
                    <p className="text-sm uppercase tracking-wider text-neutral-400 font-medium mb-2">
                      {product.series}
                    </p>
                    <h3 className="text-2xl md:text-3xl font-light text-black mb-4 tracking-tight">
                      {product.name}
                    </h3>
                    <p className="text-neutral-600 font-light leading-relaxed mb-6">
                      {product.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-medium text-black">
                      ₹{product.price}
                    </span>
                    <span className="text-lg text-neutral-400 line-through">
                      ₹{product.originalPrice}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 text-xs font-medium rounded">
                      Save ₹{parseInt(product.originalPrice) - parseInt(product.price)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="product-actions opacity-0 transform translate-y-5">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => handleBuyNow(product.id)}
                        className="buy-btn flex-1 cursor-pointer bg-black text-white px-8 py-4 text-sm font-medium uppercase tracking-wide transition-all duration-300 hover:bg-neutral-800"
                      >
                        Buy Now
                      </button>
                      
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        className="cart-btn cursor-pointer flex items-center justify-center gap-3 border border-black text-black px-8 py-4 text-sm font-medium uppercase tracking-wide transition-all duration-300 hover:bg-black hover:text-white"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
                        </svg>
                        Add to Cart
                        {cartItems[product.id] && (
                          <span className="bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {cartItems[product.id]}
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-4 mt-4 text-sm text-neutral-500">
                      <Link href={`/products/${product.id}`} className="hover:text-black transition-colors duration-300">
                        View Details
                      </Link>
                      <button className="hover:text-black transition-colors duration-300">
                        Add to Wishlist
                      </button>
                      <button className="hover:text-black transition-colors duration-300">
                        Compare
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Separator Line */}
              {index < trendingProducts.length - 1 && (
                <div className="mt-16 w-full h-px bg-neutral-200" />
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <Link href="/trending">
            <button className="group relative px-12 py-4 border border-black text-black text-sm font-medium tracking-wide uppercase overflow-hidden transition-all duration-300 hover:text-white">
              <span className="relative z-10">View All Trending Products</span>
              <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;