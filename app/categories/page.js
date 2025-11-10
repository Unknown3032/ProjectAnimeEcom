"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import CategoryCard from "@/Components/CategoryPage/CategoryCard";

const categories = [
  {
    id: 1,
    title: "Shonen",
    description: "Action-packed adventures",
    image:
      "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&h=600&fit=crop",
    itemCount: 124,
  },
  {
    id: 2,
    title: "Seinen",
    description: "Mature storytelling",
    image:
      "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=500&h=600&fit=crop",
    itemCount: 89,
  },
  {
    id: 3,
    title: "Shojo",
    description: "Romance & drama",
    image:
      "https://images.unsplash.com/photo-1613376023733-0a73315d9b06?w=500&h=600&fit=crop",
    itemCount: 156,
  },
  {
    id: 4,
    title: "Isekai",
    description: "Another world adventures",
    image:
      "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=500&h=600&fit=crop",
    itemCount: 203,
  },
  {
    id: 5,
    title: "Mecha",
    description: "Giant robots & battles",
    image:
      "https://images.unsplash.com/photo-1531329466522-442f4a3c392c?w=500&h=600&fit=crop",
    itemCount: 67,
  },
  {
    id: 6,
    title: "Slice of Life",
    description: "Everyday moments",
    image:
      "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=500&h=600&fit=crop",
    itemCount: 142,
  },
];

export default function CategoriesPage() {
  const headerRef = useRef(null);
  const subtitleRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        headerRef.current,
        {
          opacity: 0,
          y: -30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        }
      );

      // Subtitle animation
      gsap.fromTo(
        subtitleRef.current,
        {
          opacity: 0,
          y: -20,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          delay: 0.2,
          ease: "power3.out",
        }
      );

      // Grid cards stagger animation
      gsap.fromTo(
        ".category-card",
        {
          opacity: 0,
          y: 50,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          delay: 0.4,
          ease: "power3.out",
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1
            ref={headerRef}
            className="text-5xl md:text-7xl font-bold mb-4 tracking-tight"
          >
            Categories
          </h1>
          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-gray-600 font-light"
          >
            Explore our curated collection of anime gifts
          </p>
        </div>

        {/* Categories Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto"
        >
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-8 right-8 w-14 h-14 bg-black text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group"
        aria-label="Filter categories"
      >
        <svg
          className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
          />
        </svg>
      </button>
    </div>
  );
}
