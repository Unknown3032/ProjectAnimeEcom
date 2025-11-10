"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ProductBanner from "@/components/ProductsPage/ProductBanner";
import ProductFilter from "@/components/ProductsPage/ProductFilter";
import AdvancedFilters from "@/components/ProductsPage/AdvancedFilters";
import ActiveFilters from "@/components/ProductsPage/ActiveFilters";
import { getProductsBySlug, getCategoryData } from "@/lib/productsData";
// import ProductGrid from "@/Components/ProductsPage/ProductGrid";

gsap.registerPlugin(ScrollTrigger);

const ITEMS_PER_PAGE = 8;

export default function ProductsPage() {
  const params = useParams();
  const slug = params.slug || "all";

  const [allProducts, setAllProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    priceRange: "all",
    availability: "all",
    rating: "all",
    tags: [],
  });

  // Load initial products
  useEffect(() => {
    const products = getProductsBySlug(slug);
    setAllProducts(products);
    setCurrentPage(1);
    setDisplayedProducts([]);
  }, [slug]);

  // Apply filters
  const getFilteredProducts = useCallback(() => {
    let filtered = [...allProducts];

    if (filters.priceRange !== "all") {
      filtered = filtered.filter(
        (product) => product.priceRange === filters.priceRange
      );
    }

    if (filters.availability !== "all") {
      filtered = filtered.filter(
        (product) => product.availability === filters.availability
      );
    }

    if (filters.rating !== "all") {
      const minRating = parseFloat(filters.rating);
      filtered = filtered.filter((product) => product.rating >= minRating);
    }

    if (filters.tags.length > 0) {
      filtered = filtered.filter((product) =>
        filters.tags.some((tag) => product.tags.includes(tag))
      );
    }

    return filtered;
  }, [allProducts, filters]);

  // Sort products
  const getSortedProducts = useCallback(
    (products) => {
      return [...products].sort((a, b) => {
        switch (sortBy) {
          case "price-low":
            return a.price - b.price;
          case "price-high":
            return b.price - a.price;
          case "name":
            return a.name.localeCompare(b.name);
          case "rating":
            return b.rating - a.rating;
          default:
            return b.featured - a.featured;
        }
      });
    },
    [sortBy]
  );

  // Load products for current page
  useEffect(() => {
    const filtered = getFilteredProducts();
    const sorted = getSortedProducts(filtered);
    const itemsToShow = sorted.slice(0, currentPage * ITEMS_PER_PAGE);
    setDisplayedProducts(itemsToShow);
  }, [currentPage, getFilteredProducts, getSortedProducts]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  // Load more products
  const loadMore = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      setCurrentPage((prev) => prev + 1);
      setIsLoading(false);
    }, 500);
  }, [isLoading]);

  const filteredProducts = getFilteredProducts();
  const sortedProducts = getSortedProducts(filteredProducts);
  const hasMore = displayedProducts.length < sortedProducts.length;
  const categoryData = getCategoryData(slug);

  const activeFilterCount = Object.values(filters).reduce((count, value) => {
    if (Array.isArray(value)) return count + value.length;
    if (value !== "all") return count + 1;
    return count;
  }, 0);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Banner - No bottom fade */}
      <ProductBanner
        categoryData={categoryData}
        productCount={allProducts.length}
      />

      {/* Filter Bar - Directly below banner */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 backdrop-blur-sm bg-opacity-95 shadow-sm">
        <ProductFilter
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
          productCount={filteredProducts.length}
          onOpenFilters={() => setIsFilterOpen(true)}
          activeFilterCount={activeFilterCount}
        />
      </div>

      {/* Active Filters */}
      <ActiveFilters filters={filters} setFilters={setFilters} />

      {/* Advanced Filters Panel */}
      <AdvancedFilters
        filters={filters}
        setFilters={setFilters}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        {displayedProducts.length > 0 ? (
          <>
            {/* Results Count */}
            <div className="mb-8 md:mb-10">
              <p className="text-sm sm:text-base text-gray-600">
                Showing{" "}
                <span className="font-bold">{displayedProducts.length}</span> of{" "}
                <span className="font-bold">{filteredProducts.length}</span>{" "}
                products
              </p>
            </div>

            <ProductGrid
              products={displayedProducts}
              viewMode={viewMode}
              onLoadMore={loadMore}
              hasMore={hasMore}
              isLoading={isLoading}
            />
          </>
        ) : (
          <div className="text-center py-20 sm:py-32">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8 border-4 border-gray-300 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black mb-3 sm:mb-4">
              No products found
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto px-4">
              Try adjusting your filters or browse a different category
            </p>
            <button
              onClick={() =>
                setFilters({
                  priceRange: "all",
                  availability: "all",
                  rating: "all",
                  tags: [],
                })
              }
              className="px-6 sm:px-8 py-3 bg-black text-white text-sm sm:text-base font-bold hover:bg-gray-800 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-16 sm:h-16 bg-black text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 flex items-center justify-center z-50"
        aria-label="Back to top"
      >
        <svg
          className="w-5 h-5 sm:w-7 sm:h-7"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>
    </div>
  );
}
