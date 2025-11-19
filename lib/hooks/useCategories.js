'use client';

import { useState, useEffect } from 'react';

export function useCategories(options = {}) {
  const {
    includeInactive = false,
    limit = 6,
    page = 1,
    featured = false,
    parent = null,
    search = '',
    tree = false
  } = options;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 0,
    hasMore: false
  });

  useEffect(() => {
    fetchCategories();
  }, [includeInactive, limit, page, featured, parent, search, tree]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const params = new URLSearchParams();
      
      if (includeInactive) params.append('includeInactive', 'true');
      if (limit) params.append('limit', limit.toString());
      if (page) params.append('page', page.toString());
      if (featured) params.append('featured', 'true');
      if (parent !== null) params.append('parent', parent);
      if (search) params.append('search', search);
      if (tree) params.append('tree', 'true');

      const url = `/api/categories/get?${params.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store' // Ensure fresh data
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        setCategories(result.data);
        setPagination({
          total: result.total || 0,
          page: result.page || 1,
          totalPages: result.totalPages || 1,
          hasMore: result.hasMore || false
        });
      } else {
        throw new Error(result.error || 'Failed to load categories');
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError(err.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (pagination.hasMore) {
      return fetchCategories();
    }
  };

  return { 
    categories, 
    loading, 
    error, 
    pagination,
    refetch: fetchCategories,
    loadMore
  };
}