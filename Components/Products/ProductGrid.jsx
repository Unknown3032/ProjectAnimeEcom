'use client';

import { useState, useEffect, useRef } from 'react';
import ProductCard from './ProductCard';
import LoadingSpinner from '../LoadingSpinner';
import Pagination from './Pagination';
import { getProducts } from '@/lib/api/productsApi';
import { gsap } from 'gsap';

export default function ProductGrid({
  selectedCategory,
  priceRange,
  searchQuery,
  onFilterToggle,
}) {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const countRef = useRef(null);
  const gridRef = useRef(null);

  const PRODUCTS_PER_PAGE = 12;

  // Fetch products when filters or page changes
  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      
      try {
        const filters = {
          page: currentPage,
          limit: PRODUCTS_PER_PAGE,
        };

        // Add category filter
        if (selectedCategory && selectedCategory._id !== 'all') {
          filters.category = selectedCategory.name;
        }

        // Add price range filter
        if (priceRange.min > 0) {
          filters.minPrice = priceRange.min;
        }

        if (priceRange.max !== Infinity) {
          filters.maxPrice = priceRange.max;
        }

        // Add search filter
        if (searchQuery && searchQuery.trim()) {
          filters.search = searchQuery.trim();
        }

        const response = await getProducts(filters);

        if (response.success) {
          setProducts(response.data.products);
          setTotalPages(response.data.pagination.totalPages);
          setTotalProducts(response.data.pagination.totalProducts);
        } else {
          setProducts([]);
          setTotalPages(0);
          setTotalProducts(0);
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setProducts([]);
        setTotalPages(0);
        setTotalProducts(0);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [selectedCategory, priceRange, searchQuery, currentPage]);

  // Reset to page 1 when filters change (NOT when page changes)
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceRange, searchQuery]);

  // Animate count when it changes
  useEffect(() => {
    if (countRef.current && !loading) {
      gsap.fromTo(countRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out' }
      );
    }
  }, [totalProducts, loading]);

  // Scroll to top of grid when page changes
  const handlePageChange = (page) => {
    setCurrentPage(page);
    
    // Smooth scroll to top of grid
    if (gridRef.current) {
      setTimeout(() => {
        const yOffset = -100;
        const element = gridRef.current;
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({ top: y, behavior: 'smooth' });
      }, 100);
    }
  };

  // Show loading spinner on initial load
  if (loading && currentPage === 1 && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div ref={gridRef}>
      {/* Results count with mobile filter button */}
      <div className="mb-12 pb-8 border-b-2 border-black">
        <div className="flex items-center justify-between gap-4">
          <div ref={countRef} className="flex-shrink-0">
            <p className="text-xs sm:text-sm text-black tracking-[0.2em] font-bold">
              {totalProducts} {totalProducts === 1 ? 'PRODUCT' : 'PRODUCTS'}
            </p>
          </div>
          
          {/* Mobile Filter Toggle Button */}
          <button
            onClick={onFilterToggle}
            className="lg:hidden bg-black text-white px-4 sm:px-6 py-3 sm:py-3.5 shadow-lg hover:bg-gray-800 transition-all duration-500 flex items-center gap-2 flex-shrink-0"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
            <span className="text-[10px] font-bold tracking-[0.2em]">FILTERS</span>
          </button>

          {/* Desktop decorative element */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="w-12 h-0.5 bg-black"></div>
            <div className="w-2 h-2 bg-black rotate-45"></div>
            <div className="w-12 h-0.5 bg-black"></div>
          </div>
        </div>
      </div>

      {/* No products found */}
      {!loading && products.length === 0 ? (
        <div className="text-center py-32 border-2 border-black bg-gray-50">
          <div className="mb-8">
            <svg className="w-24 h-24 mx-auto text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="font-display text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            No Products Found
          </h3>
          <p className="text-gray-600 tracking-wide text-lg">
            Try adjusting your filters or search query
          </p>
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8 lg:gap-10 mb-16">
            {products.map((product, index) => (
              <ProductCard
                key={product._id || product.id || `product-${index}`}
                product={product}
                index={index}
              />
            ))}
          </div>

          {/* Loading state while fetching new page */}
          {loading && (
            <div className="py-12">
              <LoadingSpinner />
            </div>
          )}

          {/* Pagination - Only show if we have products and multiple pages */}
          {!loading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}