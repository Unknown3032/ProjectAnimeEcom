// components/CategorySection.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const CategorySection = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState({});

  const categories = [
    {
      id: 1,
      name: "Mugs",
      count: "120+ Items",
      image:
        "https://i.pinimg.com/736x/45/c7/b3/45c7b39643ec6e60a5eeb724ed7f6832.jpg",
      link: "/categories/figures",
    },
    {
      id: 2,
      name: "Keychains",
      count: "85+ Items",
      image:
        "https://i.pinimg.com/1200x/4c/5f/dd/4c5fddec863a151ee2f7fb2d195fdf55.jpg",
      link: "/categories/apparel",
    },
    {
      id: 3,
      name: "Poster",
      count: "200+ Items",
      image:
        "https://i.pinimg.com/1200x/0c/6b/9f/0c6b9f42a472299698730b33dc1a33bd.jpg",
      link: "/categories/accessories",
    },
  ];

  useEffect(() => {
    // Preload images
    categories.forEach((category) => {
      const img = new Image();
      img.onload = () => {
        setImagesLoaded((prev) => ({
          ...prev,
          [category.id]: true,
        }));
      };
      img.onerror = () => {
        setImagesLoaded((prev) => ({
          ...prev,
          [category.id]: true,
        }));
      };
      img.src = category.image;
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });

    tl.fromTo(
      titleRef.current,
      {
        y: 30,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      }
    ).fromTo(
      gridRef.current.children,
      {
        y: 50,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      },
      "-=0.4"
    );
  }, []);

  const handleCategoryHover = (index, isEntering) => {
    const card = gridRef.current.children[index];
    const image = card?.querySelector(".category-image");

    if (image) {
      gsap.to(image, {
        scale: isEntering ? 1.08 : 1,
        duration: 0.8,
        ease: "power2.out",
      });
    }
  };

  const handleImageLoad = (categoryId) => {
    setImagesLoaded((prev) => ({
      ...prev,
      [categoryId]: true,
    }));
  };

  const handleImageError = (categoryId) => {
    setImagesLoaded((prev) => ({
      ...prev,
      [categoryId]: true,
    }));
  };

  return (
    <section ref={sectionRef} className="py-24 bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-black mb-4 tracking-tight">
            Categories
          </h2>
          <p className="text-neutral-600 font-light max-w-md mx-auto">
            Explore our curated collections of premium anime merchandise
          </p>
        </div>

        {/* Categories Grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={category.link}
              className="group block"
              onMouseEnter={() => handleCategoryHover(index, true)}
              onMouseLeave={() => handleCategoryHover(index, false)}
            >
              <div className="relative overflow-hidden bg-white">
                {/* Image Container with fixed dimensions */}
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className={`category-image w-full h-full object-cover transition-opacity duration-500 ${
                      imagesLoaded[category.id] ? "opacity-100" : "opacity-0"
                    }`}
                    onLoad={() => handleImageLoad(category.id)}
                    onError={() => handleImageError(category.id)}
                    loading="lazy"
                  />

                  {/* Loading placeholder */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-neutral-200 to-neutral-300 transition-opacity duration-500 ${
                      imagesLoaded[category.id] ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-neutral-400 border-t-black rounded-full animate-spin" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-medium text-black mb-2 group-hover:text-neutral-600 transition-colors duration-300">
                    {category.name}
                  </h3>
                  <p className="text-neutral-600 text-sm font-light">
                    {category.count}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Link href="/categories">
            <button className="group cursor-pointer relative px-8 py-3 border border-black text-black text-sm font-medium tracking-wide uppercase overflow-hidden transition-all duration-300 hover:text-white">
              <span className="relative z-10">View All Categories</span>
              <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
