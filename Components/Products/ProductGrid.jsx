'use client';

import { useState, useEffect } from 'react';
import { getProducts, getProductsByCategorySlug } from '@/lib/api/productsApi';
import ProductCard from './ProductCard';

export default function ProductGrid({ 
  selectedCategory, 
  priceRange, 
  searchQuery,
  selectedAnime, // Add anime filter support
  onFilterToggle,
  onClearFilters
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  const limit = 12;

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, priceRange, searchQuery, selectedAnime, sortBy, sortOrder]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, priceRange, searchQuery, selectedAnime, page, sortBy, sortOrder]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const options = {
        page,
        limit,
        sortBy,
        order: sortOrder,
        minPrice: priceRange.min > 0 ? priceRange.min : undefined,
        maxPrice: priceRange.max < Infinity ? priceRange.max : undefined,
        search: searchQuery || undefined,
        anime: selectedAnime || undefined,
      };

      console.log('🔄 Fetching products with options:', options);

      let result;

      // If category is "all" or not selected, get all products
      if (!selectedCategory || selectedCategory.slug === 'all' || selectedCategory._id === 'all') {
        result = await getProducts(options);
      } else {
        // Get products by category - pass category name instead of slug
        options.category = selectedCategory.name; // Use category name from enum
        result = await getProducts(options);
      }

      console.log('📊 Products result:', result);

      if (result.success) {
        setProducts(result.data || []);
        setPagination(result.pagination || {});
      } else {
        throw new Error(result.message || result.error || 'Failed to load products');
      }
    } catch (err) {
      console.error('❌ Error fetching products:', err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    
    switch (value) {
      case 'price-asc':
        setSortBy('price');
        setSortOrder('asc');
        break;
      case 'price-desc':
        setSortBy('price');
        setSortOrder('desc');
        break;
      case 'name-asc':
        setSortBy('name');
        setSortOrder('asc');
        break;
      case 'newest':
        setSortBy('createdAt');
        setSortOrder('desc');
        break;
      case 'popular':
        setSortBy('purchases');
        setSortOrder('desc');
        break;
      case 'rating':
        setSortBy('rating.average');
        setSortOrder('desc');
        break;
      default:
        setSortBy('createdAt');
        setSortOrder('desc');
    }
  };

  const handleClearFilters = () => {
    if (onClearFilters) {
      onClearFilters();
    }
  };

  // Show loading on first page load
  if (loading && page === 1 && products.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm tracking-[0.3em] text-gray-500 font-medium">LOADING PRODUCTS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">
            {selectedAnime 
              ? `${selectedAnime} Products`
              : selectedCategory?.name || 'All Products'
            }
          </h2>
          <p className="text-sm text-gray-500">
            {pagination.total || 0} {pagination.total === 1 ? 'product' : 'products'} found
          </p>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button
            onClick={onFilterToggle}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-black transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-sm font-medium">Filters</span>
          </button>

          <select
            onChange={handleSortChange}
            value={`${sortBy}-${sortOrder}`}
            className="px-4 py-2 border border-gray-300 hover:border-black transition-colors text-sm bg-white cursor-pointer focus:outline-none focus:border-black"
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="purchases-desc">Most Popular</option>
            <option value="rating.average-desc">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-800 text-center font-medium mb-2">Failed to Load Products</p>
          <p className="text-red-600 text-center text-sm mb-4">{error}</p>
          <button
            onClick={fetchProducts}
            className="mx-auto block px-6 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors rounded"
          >
            Retry
          </button>
        </div>
      )}

      {/* Products Grid */}
      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={!pagination.hasPrevPage || loading}
                className="px-4 py-2 border border-gray-300 hover:border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {[...Array(Math.min(pagination.totalPages, 7))].map((_, index) => {
                  let pageNum;
                  if (pagination.totalPages <= 7) {
                    pageNum = index + 1;
                  } else if (page <= 4) {
                    pageNum = index + 1;
                  } else if (page >= pagination.totalPages - 3) {
                    pageNum = pagination.totalPages - 6 + index;
                  } else {
                    pageNum = page - 3 + index;
                  }

                  if (pageNum < 1 || pageNum > pagination.totalPages) return null;

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      disabled={loading}
                      className={`px-4 py-2 border transition-colors ${
                        page === pageNum
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-black'
                      } disabled:opacity-50`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage(page + 1)}
                disabled={!pagination.hasNextPage || loading}
                className="px-4 py-2 border border-gray-300 hover:border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : !loading ? (
        <div className="text-center py-20">
          <svg
            className="w-20 h-20 mx-auto mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
          <p className="text-gray-500 mb-6">
            {searchQuery 
              ? `No products match "${searchQuery}"`
              : 'Try adjusting your filters'
            }
          </p>
          {onClearFilters && (
            <button
              onClick={handleClearFilters}
              className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : null}
    </div>
  );
}