"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import CategoryCard from "@/Components/CategoryPage/CategoryCard";
import { useCategories } from "@/lib/hooks/useCategories";

export default function CategoriesPage() {
  const headerRef = useRef(null);
  const subtitleRef = useRef(null);
  const gridRef = useRef(null);

  const { categories, loading, error } = useCategories({
    limit: 0, // Get all categories
    tree: true, // Get hierarchical structure
  });

  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    if (categories.length > 0) {
      setFilteredCategories(categories);
    }
  }, [categories]);

  useEffect(() => {
    if (!loading && filteredCategories.length > 0) {
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
    }
  }, [loading, filteredCategories]);

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center">
          <div
            style={{
              width: "60px",
              height: "60px",
              border: "3px solid rgba(0,0,0,0.1)",
              borderTop: "3px solid black",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }}
          />
          <p className="text-gray-600">Loading categories...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <svg
            className="w-20 h-20 mx-auto mb-4 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold mb-2">Failed to Load Categories</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-black text-white hover:bg-gray-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (filteredCategories.length === 0) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <svg
            className="w-20 h-20 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
          <h2 className="text-2xl font-bold mb-2">No Categories Found</h2>
          <p className="text-gray-600">Categories will appear here once they are added.</p>
        </div>
      </div>
    );
  }

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
          {categories.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {categories.length} {categories.length === 1 ? "category" : "categories"} available
            </p>
          )}
        </div>

        {/* Categories Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto"
        >
          {filteredCategories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setShowFilter(!showFilter)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-black text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center group z-50"
        aria-label="Filter categories"
      >
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${
            showFilter ? "rotate-90" : ""
          }`}
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

      {/* Filter Panel (Optional) */}
      {showFilter && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setShowFilter(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
          />

          {/* Filter Panel */}
          <div className="fixed bottom-28 right-8 bg-white rounded-lg shadow-2xl p-6 z-50 w-80 max-w-[calc(100vw-4rem)]">
            <h3 className="text-lg font-bold mb-4">Filter Categories</h3>
            <p className="text-gray-600 text-sm">
              Filter options coming soon...
            </p>
            <button
              onClick={() => setShowFilter(false)}
              className="mt-4 w-full px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
}