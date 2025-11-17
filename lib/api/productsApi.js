import axios from '@/lib/axios';

/**
 * Products API Helper Functions using Axios
 */

// Get featured products
export async function getFeaturedProducts(limit = 10) {
  try {
    const { data } = await axios.get(`/api/products/featured?limit=${limit}`);
    return data;
  } catch (error) {
    console.error('Get featured products error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch featured products'
    };
  }
}

// Get product by slug
export async function getProductBySlug(slug) {
  try {
    const { data } = await axios.get(`/api/products/${slug}`);
    return data;
  } catch (error) {
    console.error('Get product error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch product'
    };
  }
}

// Get products by category
export async function getProductsByCategory(category, page = 1, limit = 20) {
  try {
    const { data } = await axios.get(`/api/products/category/${category}`, {
      params: { page, limit }
    });
    return data;
  } catch (error) {
    console.error('Get products by category error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch products'
    };
  }
}

// Get products by anime
export async function getProductsByAnime(animeName, page = 1, limit = 20) {
  try {
    const { data } = await axios.get(`/api/products/anime/${animeName}`, {
      params: { page, limit }
    });
    return data;
  } catch (error) {
    console.error('Get products by anime error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch products'
    };
  }
}

// Search products
export async function searchProducts(query, page = 1, limit = 20, filters = {}) {
  try {
    const { data } = await axios.get('/api/products/search', {
      params: { q: query, page, limit, ...filters }
    });
    return data;
  } catch (error) {
    console.error('Search products error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to search products'
    };
  }
}

// Get all products with filters
export async function getProducts(filters = {}) {
  try {
    const { data } = await axios.get('/api/products', {
      params: filters
    });
    return data;
  } catch (error) {
    console.error('Get products error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch products'
    };
  }
}

// Get product reviews
export async function getProductReviews(productId) {
  try {
    const { data } = await axios.get(`/api/products/${productId}/reviews`);
    return data;
  } catch (error) {
    console.error('Get product reviews error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch reviews'
    };
  }
}

// Add product review
export async function addProductReview(productId, reviewData) {
  try {
    const { data } = await axios.post(`/api/products/${productId}/reviews`, reviewData);
    return data;
  } catch (error) {
    console.error('Add product review error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to add review'
    };
  }
}

// Update product review
export async function updateProductReview(productId, reviewId, reviewData) {
  try {
    const { data } = await axios.put(`/api/products/${productId}/reviews/${reviewId}`, reviewData);
    return data;
  } catch (error) {
    console.error('Update product review error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to update review'
    };
  }
}

// Delete product review
export async function deleteProductReview(productId, reviewId) {
  try {
    const { data } = await axios.delete(`/api/products/${productId}/reviews/${reviewId}`);
    return data;
  } catch (error) {
    console.error('Delete product review error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to delete review'
    };
  }
}

// Mark review as helpful
export async function markReviewHelpful(productId, reviewId) {
  try {
    const { data } = await axios.post(`/api/products/${productId}/reviews/${reviewId}/helpful`);
    return data;
  } catch (error) {
    console.error('Mark review helpful error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to mark review as helpful'
    };
  }
}