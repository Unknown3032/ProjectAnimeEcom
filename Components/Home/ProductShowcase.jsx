// components/ProductShowcase.jsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ProductShowcase = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const imageRefs = useRef({});

  const products = [
    {
      id: 1,
      name: "Essential Tee",
      price: "1,299",
      originalPrice: "1,599",
      image: "https://images.unsplash.com/photo-1741738582568-01995ea45776?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=685",
      category: "Basics",
      isNew: true
    },
    {
      id: 2,
      name: "Demon Slayer Mug",
      price: "299",
      originalPrice: "999",
      image: "https://mugdog.in/cdn/shop/files/anime1.jpg?v=1759476564&width=533",
      category: "Mug",
      isNew: false
    },
   
    {
      id: 3,
      name: "Comfort Hoodie",
      price: "2,799",
      originalPrice: "3,299",
      image: "https://images.unsplash.com/photo-1564557287817-3785e38ec1f5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687",
      category: "Basics",
      isNew: true
    }
  ];

  // Check if image is already loaded (cached)
  const checkImageLoaded = (src, productId) => {
    const img = new Image();
    img.onload = () => {
      setImagesLoaded(prev => ({
        ...prev,
        [productId]: true
      }));
    };
    img.onerror = () => {
      console.warn('Failed to load product image:', productId);
      setImagesLoaded(prev => ({
        ...prev,
        [productId]: true
      }));
    };
    
    // Check if image is already cached
    if (img.complete) {
      setImagesLoaded(prev => ({
        ...prev,
        [productId]: true
      }));
    } else {
      img.src = src;
    }
  };

  // Preload images on component mount
  useEffect(() => {
    products.forEach(product => {
      checkImageLoaded(product.image, product.id);
    });
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo(titleRef.current, {
      y: 30,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: "power3.out"
    })
    .fromTo(gridRef.current.children, {
      y: 50,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out"
    }, "-=0.4");
  }, []);

  const handleImageLoad = (productId) => {
    setImagesLoaded(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  const handleImageError = (productId) => {
    console.warn('Failed to load product image:', productId);
    setImagesLoaded(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  const handleProductHover = (index, isEntering) => {
    const card = gridRef.current.children[index];
    const image = card?.querySelector('.product-image');
    const overlay = card?.querySelector('.product-overlay');
    
    if (image && overlay) {
      gsap.to(image, {
        scale: isEntering ? 1.08 : 1,
        duration: 0.8,
        ease: "power2.out"
      });
      
      gsap.to(overlay, {
        opacity: isEntering ? 1 : 0,
        duration: 0.4,
        ease: "power2.out"
      });
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="py-24 bg-white select-none"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div 
          ref={titleRef}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-light text-black mb-4 tracking-tight">
            Featured
          </h2>
          <p className="text-neutral-500 font-light text-lg max-w-md mx-auto">
            Carefully curated essentials for the modern lifestyle
          </p>
        </div>

        <div 
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16"
        >
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group cursor-pointer"
              onMouseEnter={() => handleProductHover(index, true)}
              onMouseLeave={() => handleProductHover(index, false)}
            >
              {/* Product Image Container */}
              <div className="relative mb-6 overflow-hidden bg-neutral-50">
                <div className="aspect-3/4 relative">
                  <img
                    ref={el => imageRefs.current[product.id] = el}
                    src={product?.image}
                    alt={product.name}
                    className={`product-image w-full h-full object-cover transition-opacity duration-500 ${
                      imagesLoaded[product.id] ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={() => handleImageLoad(product.id)}
                    onError={() => handleImageError(product.id)}
                    loading="lazy"
                    // Add cache busting and better loading attributes
                    crossOrigin="anonymous"
                    decoding="async"
                  />
                  
                  {/* Loading placeholder */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200 transition-opacity duration-500 ${
                    imagesLoaded[product.id] ? 'opacity-0' : 'opacity-100'
                  }`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-600 rounded-full animate-spin"></div>
                    </div>
                  </div>

                  {/* New Badge */}
                  {product.isNew && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-black text-white px-3 py-1 text-xs font-medium uppercase tracking-wider">
                        New
                      </span>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="product-overlay absolute inset-0 bg-black/10 opacity-0 flex items-end justify-center pb-8">
                    <Link href={`/products/${product.id}`}>
                      <button className="bg-white cursor-pointer text-black px-8 py-3 text-sm font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                        View Product
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Product Info */}
              <div className="space-y-2">
                {/* Category */}
                <p className="text-xs text-neutral-400 uppercase tracking-widest font-medium">
                  {product.category}
                </p>
                
                {/* Product Name */}
                <Link href={`/products/${product.id}`}>
                  <h3 className="text-lg font-medium text-black hover:text-neutral-600 transition-colors duration-300">
                    {product.name}
                  </h3>
                </Link>
                
                {/* Price */}
                <div className="flex items-baseline space-x-2 pt-1">
                  <span className="text-black font-medium">
                    ₹{product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-neutral-400 text-sm line-through">
                      ₹{product.originalPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-20">
          <Link href="/shop">
            <button className="group cursor-pointer relative px-12 py-4 border border-black text-black text-sm font-medium tracking-widest uppercase overflow-hidden transition-all duration-500 hover:text-white">
              <span className="relative z-10">View All</span>
              <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;