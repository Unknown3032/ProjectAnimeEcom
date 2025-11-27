'use client';

import { useState, useEffect } from 'react';
import { getProductsByCategorySlug } from '@/lib/api/products';

export function useCategoryProducts(categorySlug, options = {}) {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [filters, setFilters] = useState({});

  useEffect(() => {
    if (categorySlug) {
      fetchProducts();
    }
  }, [categorySlug, JSON.stringify(options)]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getProductsByCategorySlug(categorySlug, options);

      if (result.success) {
        setProducts(result.data || []);
        setCategory(result.category || null);
        setPagination(result.pagination || {});
        setFilters(result.filters || {});
      } else {
        throw new Error(result.message || 'Failed to load products');
      }
    } catch (err) {
      console.error('Error fetching category products:', err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    category,
    loading,
    error,
    pagination,
    filters,
    refetch: fetchProducts,
  };
}