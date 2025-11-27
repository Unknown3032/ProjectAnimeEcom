"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";

export default function CategoryCard({ category }) {
  const router = useRouter();
  const cardRef = useRef(null);
  const imageRef = useRef(null);

  const handleMouseEnter = () => {
    gsap.to(imageRef.current, {
      scale: 1.1,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(imageRef.current, {
      scale: 1,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  const handleClick = () => {
    router.push(`/productspage/${category.slug || category._id}`);
  };

  // Get category image
  const getCategoryImage = () => {
    if (category.images && category.images.length > 0) {
      const primaryImage = category.images.find((img) => img.isPrimary);
      if (primaryImage) {
        return typeof primaryImage === "string" ? primaryImage : primaryImage.url;
      }
      const firstImage = category.images[0];
      return typeof firstImage === "string" ? firstImage : firstImage.url;
    }
    return category.image || "/images/placeholder-category.jpg";
  };

  // Get subcategories count
  const getItemCount = () => {
    if (category.children && category.children.length > 0) {
      return category.children.length;
    }
    if (category.itemCount) return category.itemCount;
    if (category.productCount) return category.productCount;
    return 0;
  };

  const categoryImage = getCategoryImage();
  const itemCount = getItemCount();

  return (
    <div
      ref={cardRef}
      className="category-card group cursor-pointer relative overflow-hidden bg-white border border-gray-200 hover:border-black transition-all duration-500 hover:shadow-2xl"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Image Container */}
      <div className="relative h-80 overflow-hidden bg-gray-100">
        <img
          ref={imageRef}
          src={categoryImage}
          alt={category.name || category.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "/images/placeholder-category.jpg";
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Item Count Badge */}
        <div className="absolute top-4 right-4 bg-white text-black px-3 py-1 text-xs font-semibold tracking-wider">
          {itemCount} {itemCount === 1 ? "ITEM" : "ITEMS"}
        </div>
      </div>

      {/* Content */}
      <div className="p-6 relative">
        <h3 className="text-2xl font-bold mb-2 tracking-tight group-hover:translate-x-2 transition-transform duration-300">
          {category.name || category.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {category.description || category.tagline || "Explore this category"}
        </p>

        {/* Arrow Icon */}
        <div className="flex items-center text-sm font-semibold tracking-wider uppercase group-hover:translate-x-2 transition-transform duration-300">
          <span>Explore</span>
          <svg
            className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>

        {/* Subcategories preview (if available) */}
        {category.children && category.children.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              Subcategories:
            </p>
            <div className="flex flex-wrap gap-2">
              {category.children.slice(0, 3).map((child, index) => (
                <span
                  key={child._id || index}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  {child.name}
                </span>
              ))}
              {category.children.length > 3 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{category.children.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Active/Featured Badges */}
        {category.isFeatured && (
          <div className="absolute top-6 left-6">
            <span className="bg-black text-white text-xs px-3 py-1 font-semibold">
              FEATURED
            </span>
          </div>
        )}
      </div>
    </div>
  );
}