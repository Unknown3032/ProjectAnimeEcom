'use client';

import { useState, useEffect } from 'react';
import { getProductById, getFeaturedProducts } from '@/lib/api/productsApi';

export function useProduct(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getProductById(productId);
      
      if (result.success) {
        setProduct(result.data);
        console.log(result.data);
        
      } else {
        throw new Error(result.message || 'Failed to load product');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  return { product, loading, error, refetch: fetchProduct };
}

export function useFeaturedProducts(limit = 4) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [limit]);

  const fetchFeaturedProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await getFeaturedProducts(limit);
      
      if (result.success) {
        setProducts(result.data || []);
      } else {
        throw new Error(result.message || 'Failed to load featured products');
      }
    } catch (err) {
      console.error('Error fetching featured products:', err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, refetch: fetchFeaturedProducts };
}