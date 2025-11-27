import axios from '@/lib/axios';

/**
 * Products API Helper Functions using Axios
 */

// ============= TRENDING & FEATURED PRODUCTS =============

/**
 * Get trending products
 * @param {Object} options - Query options
 * @returns {Promise} Product data with pagination
 */
export async function getTrendingProducts(options = {}) {
  try {
    const { 
      limit = 12, 
      page = 1, 
      sortBy = 'trending' 
    } = options;

    const { data } = await axios.get('/api/products/trending', {
      params: { limit, page, sortBy }
    });
    
    return data;
  } catch (error) {
    console.error('Get trending products error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to fetch trending products',
      message: error.response?.data?.message || error.message,
      data: {
        products: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalProducts: 0,
          limit: 12,
          hasNextPage: false,
          hasPrevPage: false
        }
      }
    };
  }
}

/**
 * Get featured products
 * @param {number} limit - Number of products to fetch
 * @returns {Promise} Product data
 */
export async function getFeaturedProducts(limit = 10) {
  try {
    const { data } = await axios.get(`/api/products/featured?limit=${limit}`);
    return data;
  } catch (error) {
    console.error('Get featured products error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to fetch featured products',
      message: error.response?.data?.message || error.message
    };
  }
}

/**
 * Get new arrivals
 * @param {number} limit - Number of products to fetch
 * @returns {Promise} Product data
 */
export async function getNewArrivals(limit = 12) {
  try {
    const { data } = await axios.get('/api/products/new-arrivals', {
      params: { limit }
    });
    return data;
  } catch (error) {
    console.error('Get new arrivals error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to fetch new arrivals',
      message: error.response?.data?.message || error.message
    };
  }
}

/**
 * Get bestsellers
 * @param {number} limit - Number of products to fetch
 * @returns {Promise} Product data
 */
export async function getBestsellers(limit = 12) {
  try {
    const { data } = await axios.get('/api/products/bestsellers', {
      params: { limit }
    });
    return data;
  } catch (error) {
    console.error('Get bestsellers error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to fetch bestsellers',
      message: error.response?.data?.message || error.message
    };
  }
}

// ============= PRODUCT RETRIEVAL =============

/**
 * Get all products with filters
 * @param {Object} filters - Filter parameters
 * @returns {Promise} Products data
 */
export async function getProducts( options) {
  try {
    const { data } = await axios.get('/api/products', {
      params: options
    });
    return data;
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to fetch products',
      message: error.response?.data?.message || error.message,
      data: {
        products: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalProducts: 0,
          limit: 12,
          hasNextPage: false,
          hasPrevPage: false
        }
      }
    };
  }
}

/**
 * Get product by ID or slug
 * @param {string} identifier - Product ID or slug
 * @returns {Promise} Product data
 */
export async function getProductById(identifier) {
  try {
    if (!identifier) {
      return {
        success: false,
        error: 'Product identifier is required',
        message: 'Product ID or slug must be provided'
      };
    }

    const { data } = await axios.get(`/api/products/${identifier}`);
    return data;
  } catch (error) {
    console.error('Get product error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to fetch product',
      message: error.response?.data?.message || error.message || 'Product not found'
    };
  }
}

// Alias for backward compatibility
export const getProductBySlug = getProductById;

/**
 * Get products by category ID
 * @param {string} categoryId - Category ID
 * @param {Object} options - Query options
 * @returns {Promise} Products data
 */
export async function getProductsByCategory(categoryId, options = {}) {
  try {
    const { 
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      order = 'desc',
      minPrice,
      maxPrice,
      inStock,
      featured,
      search
    } = options;

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      order,
    });

    if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
    if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());
    if (inStock) params.append('inStock', 'true');
    if (featured) params.append('featured', 'true');
    if (search) params.append('search', search);

    const { data } = await axios.get(`/api/products/category/${categoryId}?${params.toString()}`);
    return data;
  } catch (error) {
    console.error('Get products by category error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to fetch products',
      message: error.response?.data?.message || error.message,
      data: [],
      pagination: {
        total: 0,
        page: 1,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      }
    };
  }
}

/**
 * Get products by category slug
 * @param {string} slug - Category slug
 * @param {Object} options - Query options
 * @returns {Promise} Products data
 */
export async function getProductsByCategorySlug(slug, options = {}) {
  try {
    const { 
      page = 1, 
      limit = 20,
      sortBy = 'createdAt',
      order = 'desc',
      minPrice,
      maxPrice,
      inStock,
      featured,
      search
    } = options;

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      order,
    });

    if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
    if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());
    if (inStock) params.append('inStock', 'true');
    if (featured) params.append('featured', 'true');
    if (search) params.append('search', search);

    const { data } = await axios.get(`/api/products/bycategory/${slug}?${params.toString()}`);
    return data;
  } catch (error) {
    console.error('Get products by category slug error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to fetch products',
      message: error.response?.data?.message || error.message,
      data: [],
      pagination: {
        total: 0,
        page: 1,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      }
    };
  }
}

/**
 * Get products by anime
 * @param {string} animeName - Anime name
 * @param {Object} options - Query options
 * @returns {Promise} Products data
 */
export async function getProductsByAnime(animeName, options = {}) {
  try {
    const { page = 1, limit = 20 } = options;
    
    const { data } = await axios.get('/api/products', {
      params: { 
        anime: animeName,
        page,
        limit
      }
    });
    return data;
  } catch (error) {
    console.error('Get products by anime error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to fetch products',
      message: error.response?.data?.message || error.message
    };
  }
}

/**
 * Search products
 * @param {string} query - Search query
 * @param {Object} options - Additional options
 * @returns {Promise} Products data
 */
export async function searchProducts(query, options = {}) {
  try {
    const { page = 1, limit = 20, ...filters } = options;
    
    const { data } = await axios.get('/api/products', {
      params: { 
        search: query,
        page,
        limit,
        ...filters
      }
    });
    return data;
  } catch (error) {
    console.error('Search products error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to search products',
      message: error.response?.data?.message || error.message
    };
  }
}

/**
 * Get related products
 * @param {string} productId - Product ID
 * @param {number} limit - Number of products to fetch
 * @returns {Promise} Products data
 */
export async function getRelatedProducts(productId, limit = 6) {
  try {
    const { data } = await axios.get(`/api/products/${productId}/related`, {
      params: { limit }
    });
    return data;
  } catch (error) {
    console.error('Get related products error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to fetch related products',
      message: error.response?.data?.message || error.message
    };
  }
}

// ============= PRODUCT INTERACTIONS =============

/**
 * Increment product views
 * @param {string} productId - Product ID
 * @returns {Promise}
 */
export async function incrementProductViews(productId) {
  try {
    const { data } = await axios.post(`/api/products/${productId}/views`);
    return data;
  } catch (error) {
    console.error('Increment views error:', error);
    // Silently fail for view tracking
    return { success: false };
  }
}

/**
 * Add to wishlist
 * @param {string} productId - Product ID
 * @returns {Promise}
 */
export async function addToWishlist(productId) {
  try {
    const { data } = await axios.post(`/api/products/${productId}/wishlist`);
    return data;
  } catch (error) {
    console.error('Add to wishlist error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to add to wishlist',
      message: error.response?.data?.message || error.message
    };
  }
}

/**
 * Remove from wishlist
 * @param {string} productId - Product ID
 * @returns {Promise}
 */
export async function removeFromWishlist(productId) {
  try {
    const { data } = await axios.delete(`/api/products/${productId}/wishlist`);
    return data;
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to remove from wishlist',
      message: error.response?.data?.message || error.message
    };
  }
}

// ============= REVIEWS =============

/**
 * Get product reviews
 * @param {string} productId - Product ID
 * @returns {Promise} Reviews data
 */
export async function getProductReviews(productId) {
  try {
    const { data } = await axios.get(`/api/products/${productId}/reviews`);
    return data;
  } catch (error) {
    console.error('Get product reviews error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to fetch reviews',
      message: error.response?.data?.message || error.message
    };
  }
}

/**
 * Add product review
 * @param {string} productId - Product ID
 * @param {Object} reviewData - Review data (rating, comment, images)
 * @returns {Promise}
 */
export async function addProductReview(productId, reviewData) {
  try {
    const { data } = await axios.post(`/api/products/${productId}/reviews`, reviewData);
    return data;
  } catch (error) {
    console.error('Add product review error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to add review',
      message: error.response?.data?.message || error.message
    };
  }
}

/**
 * Update product review
 * @param {string} productId - Product ID
 * @param {string} reviewId - Review ID
 * @param {Object} reviewData - Updated review data
 * @returns {Promise}
 */
export async function updateProductReview(productId, reviewId, reviewData) {
  try {
    const { data } = await axios.put(`/api/products/${productId}/reviews/${reviewId}`, reviewData);
    return data;
  } catch (error) {
    console.error('Update product review error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to update review',
      message: error.response?.data?.message || error.message
    };
  }
}

/**
 * Delete product review
 * @param {string} productId - Product ID
 * @param {string} reviewId - Review ID
 * @returns {Promise}
 */
export async function deleteProductReview(productId, reviewId) {
  try {
    const { data } = await axios.delete(`/api/products/${productId}/reviews/${reviewId}`);
    return data;
  } catch (error) {
    console.error('Delete product review error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to delete review',
      message: error.response?.data?.message || error.message
    };
  }
}

/**
 * Mark review as helpful
 * @param {string} productId - Product ID
 * @param {string} reviewId - Review ID
 * @returns {Promise}
 */
export async function markReviewHelpful(productId, reviewId) {
  try {
    const { data } = await axios.post(`/api/products/${productId}/reviews/${reviewId}/helpful`);
    return data;
  } catch (error) {
    console.error('Mark review helpful error:', error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Failed to mark review as helpful',
      message: error.response?.data?.message || error.message
    };
  }
}